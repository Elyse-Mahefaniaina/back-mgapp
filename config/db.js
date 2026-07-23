const { Sequelize } = require('sequelize');
const dotenv = require("dotenv");

dotenv.config();

// SSL requis par la plupart des MySQL managés (Aiven, TiDB Cloud...).
// Activer avec DB_SSL=true.
// Aiven signe avec une CA privée : fournir son certificat via DB_SSL_CA
// (contenu PEM, les retours ligne peuvent être encodés en \n) pour une
// vérification stricte. Sans CA fourni, la connexion reste chiffrée mais
// sans vérification du certificat serveur.
const useSsl = process.env.DB_SSL === "true";

let ssl;
if (useSsl) {
  if (process.env.DB_SSL_CA) {
    ssl = {
      ca: process.env.DB_SSL_CA.replace(/\\n/g, "\n"),
      rejectUnauthorized: true,
    };
  } else {
    ssl = { rejectUnauthorized: false };
  }
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DIALECT || "mysql",
    logging: null,
    dialectOptions: useSsl ? { ssl } : {},
    // Pool réduite : indispensable en serverless (Vercel) pour ne pas
    // dépasser la limite de connexions du plan Aiven gratuit.
    pool: {
      max: Number(process.env.DB_POOL_MAX) || 3,
      min: 0,
      idle: 10000,
      acquire: 30000,
    },
  }
);

module.exports = sequelize;