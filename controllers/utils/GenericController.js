const { Op } = require("sequelize");
const sequelize = require('../../config/db');
const MenuItem = require('../../models/core/MenuItem');

function createGenericController(Model, relations = {}, excludeFields = [], selects = [], extraFieldsMeta = []) {
  function parseFilter(filterString) {
    if (!filterString) return {};

    const where = {};
    const conditions = filterString.split(/ and | AND /i);

    conditions.forEach(condition => {
      const match = condition.match(/(\w+)\s+(eq|ne|gt|lt|like)\s+'([^']+)'/i);
      if (match) {
        const [, field, op, value] = match;
        const sequelizeOp = {
          eq: Op.eq,
          ne: Op.ne,
          gt: Op.gt,
          lt: Op.lt,
          like: Op.like
        }[op.toLowerCase()];

        where[field] = { [sequelizeOp]: value };
      }
    });

    return where;
  }

  return {
    async findAll(req, res) {
      try {
        const { $filter, $top, $skip, $expand, $order } = req.query;
        const where = parseFilter($filter);

        let include = [];
        if ($expand) {
          const includes = $expand.split(",");
          include = includes.filter(k => relations[k]).map(k => relations[k]);
        }
        
        let order = Model != MenuItem ? [["id", "DESC"]] : [];
        if ($order) {
          order = $order.split(",").map(o => {
            const [field, dir] = o.trim().split(/\s+/);
            return [field, dir ? (dir.toUpperCase() === "DESC" ? "DESC" : "ASC") : "ASC"];
          });
        }

        const limit = $top ? parseInt($top, 10) : undefined;
        const offset = $skip ? parseInt($skip, 10) : undefined;

        const data = await Model.findAll({
          where,
          include,
          limit,
          offset,
          order,
          attributes: { exclude: excludeFields }
        });

        return res.json({ count: data.length, data });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    async findOne(req, res) {
      try {
        const { id } = req.params;
        const { $expand, $order } = req.query;

        let include = [];
        if ($expand) {
          const includes = $expand.split(",");
          include = includes.filter(k => relations[k]).map(k => relations[k]);
        }

        let order;
        if ($order) {
          order = $order.split(",").map(o => {
            const [field, dir] = o.trim().split(/\s+/);
            return [field, dir.toUpperCase() === "DESC" ? "DESC" : "ASC"];
          });
        }

        const item = await Model.findByPk(id, {
          include,
          order,
          attributes: { exclude: excludeFields }
        });

        if (!item) return res.status(404).json({ error: "Not found" });

        return res.json(item);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    async create(req, res) {
      const t = await sequelize.transaction();
      try {
        const body = { ...req.body };
        
        Object.entries(body).forEach(([key, value]) => {
          if (value && typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            body[key] = new Date(value);
          }
        });
        
        const item = await Model.create(body, {
          context: {
            user_id: req.user.id
          }
        });
        await t.commit();
        
        excludeFields.forEach(f => delete item.dataValues[f]);
        
        return res.status(201).json(item);
      } catch (err) {
        await t.rollback();
        return res.status(500).json(err);
      }
    },

    async update(req, res) {
      try {
        const { id } = req.params;
        const item = await Model.findByPk(id);
        if (!item) return res.status(404).json({ error: "Not found" });

        await item.update(req.body);
        excludeFields.forEach(f => delete item.dataValues[f]);
        return res.json(item);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    },

    async remove(req, res) {
      try {
        const { id } = req.params;
        const item = await Model.findByPk(id);
        if (!item) return res.status(404).json({ error: "Not found" });

        await item.destroy();
        return res.json({ message: "Deleted successfully" });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    metadata: async (req, res) => {
      try {
        const fields = Object.entries(Model.rawAttributes)
          .filter(([name]) => !excludeFields.includes(name))
          .map(([name, attr]) => {
            const selectConfig = selects.find(s => s.field === name);
            const extraFieldMetaData = extraFieldsMeta.find(e => e.field === name);

            return {
              name,
              type: selectConfig ? "SELECT" : attr.type.key,
              enumValues: attr.type.key === "ENUM" ? attr.type.values : null,

              select: selectConfig
                ? {
                    controller: selectConfig.controller,
                    valueKey: selectConfig.valueKey,
                    labelKey: selectConfig.labelKey
                  }
                : null,

              allowNull: attr.allowNull,
              defaultValue: attr.defaultValue !== undefined ? attr.defaultValue : null,
              primaryKey: attr.primaryKey || false,
              unique: attr.unique || false,
              autoIncrement: attr.autoIncrement || false,
              extraFieldsMeta: extraFieldMetaData ? extraFieldMetaData : null
            };
          });

        return res.json({
          model: Model.name,
          fields
        });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

  };
}

module.exports = createGenericController;
