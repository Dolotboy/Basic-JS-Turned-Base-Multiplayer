const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let players = [];
let currentTurnIndex = 0;

// Fonction pour envoyer le nombre de joueurs connectés
function updatePlayerCount() {
    io.emit('playersUpdate', players.length);
}

// Connexion d'un joueur
io.on('connection', (socket) => {
    console.log(`Joueur connecté : ${socket.id}`);

    // Ajouter le joueur à la liste
    const player = { id: socket.id, name: `Joueur ${players.length + 1}` };
    players.push(player);

    // Envoyer l'état du jeu à tous les joueurs
    io.emit('gameState', { players, currentTurnIndex });
    updatePlayerCount(); // Mettre à jour le nombre de joueurs connectés

    // Passer au joueur suivant
    socket.on('nextTurn', () => {
        if (socket.id === players[currentTurnIndex].id) {
            currentTurnIndex = (currentTurnIndex + 1) % players.length;
            io.emit('currentTurn', { currentTurnIndex });
        }
    });

    // Déconnexion d'un joueur
    socket.on('disconnect', () => {
        console.log(`Joueur déconnecté : ${socket.id}`);
        players = players.filter((p) => p.id !== socket.id);

        // Ajuster l'indice de tour si nécessaire
        if (currentTurnIndex >= players.length) {
            currentTurnIndex = 0;
        }

        io.emit('gameState', { players, currentTurnIndex });
        updatePlayerCount(); // Mettre à jour le nombre de joueurs connectés
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
