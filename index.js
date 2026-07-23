const express = require("express");
const cors = require("cors");
const path = require('path')
const sequelize = require("./config/db");
const authenticateToken = require('./middleware/middleware');
const cookieParser = require("cookie-parser");

const Achat = require('./models/achat/Achat');

const applyAchatHooks = require('./hooks/achatHooks');

const fournisseurRoutes = require('./routes/fournisseurRoutes');
const fournisseurContactRoute = require('./routes/fournisseurContactRoute');
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');
const userContactRoutes = require('./routes/userContactRoutes');
const userRolesRoutes = require('./routes/userRolesRoutes');
const produitRoutes = require('./routes/produitsRoute');
const loginRoute = require('./routes/loginRoute');
const planComptableRoute = require('./routes/planComptableRoute');
const siteActiviteRoute = require('./routes/SiteActiviteRoute');
const prouduitFournisseurRoute = require('./routes/produitFournisseurRoute');
const clientRoute = require('./routes/clientRoute');
const clientContactRoute = require('./routes/clientContactRoute');
const menuItemRoute = require('./routes/menuItemRoute');
const pageRoute = require('./routes/pageRoute');
const pageContentRoute = require('./routes/pageContentRoute');
const pageContentActionRoute = require('./routes/pageContentActionRoute');
const vehiculeRoutes = require('./routes/vehiculeRoutes');
const inventaireRoute = require('./routes/inventaireRoute');
const achatRoute = require('./routes/achatRoute');
const achatProduitRoute = require('./routes/achatProduitRoute');
const achatStatusRoute = require('./routes/achatStatusRoute');
const achatReceptionRoute = require('./routes/achatReceptionRoute');
const achatPaiementRoute = require('./routes/achatPaiementRoute');
const margeBeneficiaireRoute = require('./routes/margeBeneficiaireRoute');
const prixVenteRoute = require('./routes/prixVenteRoute');
const etatprixVenteRoute = require('./routes/etatprixVenteRoute');
const stockRoute = require('./routes/StockRoute');
const etatStockRoute = require('./routes/EtatStockRoute');
const venteRoute = require('./routes/venteRoute');
const transportRoute = require('./routes/transportRoute');
const dashBoardRoute = require('./routes/dashBoardRoute');
const initAssociations = require('./models/transport/associations');

applyAchatHooks(Achat);

sequelize.authenticate()
  .then(() => {
    console.log("Connexion à MySQL réussie.");
    return sequelize.sync({update: true});
  })
  .catch(err => console.error("Échec de connexion à MySQL :", err));

initAssociations();

// Origines autorisées : liste séparée par des virgules dans FRONTEND_URL
// (ex. "https://mon-front.vercel.app,http://localhost:5173").
// Fallback sur localhost:5173 pour le dev.
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Autorise les requêtes sans origine (Postman, curl, same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origine non autorisée par CORS : ${origin}`));
  },
  credentials: true,
};

const app = express();

app.use('/assets',express.static(path.join(__dirname, 'assets')));

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json({ extended: true }));

app.use('/api/auth', loginRoute);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/user-contacts', authenticateToken, userContactRoutes);
app.use('/api/user-roles', authenticateToken, userRolesRoutes);
app.use('/api/roles',authenticateToken, roleRoutes);
app.use('/api/site',authenticateToken, siteActiviteRoute);
app.use('/api/menu-items',authenticateToken, menuItemRoute);
app.use('/api/pages',authenticateToken, pageRoute);
app.use('/api/page-contents',authenticateToken, pageContentRoute);
app.use('/api/page-content-actions',authenticateToken, pageContentActionRoute);
app.use('/api/fournisseurs',authenticateToken, fournisseurRoutes);
app.use('/api/fournisseur-contacts',authenticateToken, fournisseurContactRoute);
app.use('/api/produits',authenticateToken, produitRoutes);
app.use('/api/produit-fournisseurs',authenticateToken, prouduitFournisseurRoute);
app.use('/api/plan-comptables',authenticateToken, planComptableRoute);
app.use('/api/clients',authenticateToken, clientRoute);
app.use('/api/client-contacts',authenticateToken, clientContactRoute);
app.use('/api/inventaires',authenticateToken, inventaireRoute);
app.use('/api/vehicules', authenticateToken, vehiculeRoutes);
app.use('/api/achats', authenticateToken, achatRoute);
app.use('/api/achat-produits', authenticateToken, achatProduitRoute);
app.use('/api/achat-status', authenticateToken, achatStatusRoute);
app.use('/api/achat-receptions', authenticateToken, achatReceptionRoute);
app.use('/api/achat-paiements', authenticateToken, achatPaiementRoute);
app.use('/api/marge', authenticateToken, margeBeneficiaireRoute);
app.use('/api/sale-coasts', authenticateToken, prixVenteRoute);
app.use('/api/sale-coast-states', authenticateToken, etatprixVenteRoute);
app.use('/api/stocks', authenticateToken, stockRoute);
app.use('/api/etat-stocks', authenticateToken, etatStockRoute);
app.use('/api/sales', authenticateToken, venteRoute);
app.use('/api/transports', authenticateToken, transportRoute);
app.use('/api/dashboards', authenticateToken, dashBoardRoute);

// En local (et sur Render) on démarre un vrai serveur.
// Sur Vercel (serverless), on n'appelle PAS listen : Vercel utilise l'app exportée.
if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server is running on the port ${port}`));
}

module.exports = app;