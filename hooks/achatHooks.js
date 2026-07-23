const AchatStatus = require('../models/achat/AchatStatus');

const applyAchatHooks = (Achat) => {
    Achat.afterCreate(async (achat, options) => {
    try {
        await AchatStatus.create(
        {
            achat_id: achat.id,
            status: 'CREER',
            user_id: options.context?.user_id,
            date: new Date()
        },
        {
            transaction: options.transaction
        }
        );
    } catch (err) {
        console.error("AchatStatus error:", err);
        throw err;
    }
    });

};

module.exports = applyAchatHooks;