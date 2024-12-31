# Utiliser une image Node.js officielle
FROM node:18

# Créer et utiliser le dossier de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package.json /app/

# Installer les dépendances
RUN npm install

# Copier tout le reste du code
COPY . /app/

# Exposer le port que le serveur utilise
EXPOSE 3000

# Démarrer le serveur
CMD ["node", "server.js"]

