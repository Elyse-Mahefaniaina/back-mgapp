const bcrypt = require('bcrypt');

const password = process.argv[2]; // Le mot de passe à hasher passé en argument

if (!password) {
  console.error("Veuillez fournir un mot de passe en argument !");
  process.exit(1);
}

(async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("Mot de passe hashé :", hashedPassword);
})();
