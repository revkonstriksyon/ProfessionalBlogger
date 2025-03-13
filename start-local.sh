
#!/bin/bash

# S'assurer que nous sommes dans la racine du projet
cd "$(dirname "$0")"

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
  echo "Installation des dépendances..."
  npm install
fi

# Variables d'environnement pour la compatibilité locale
export PORT=5000

# Démarrer l'application
echo "Démarrage de l'application..."
npm run dev
