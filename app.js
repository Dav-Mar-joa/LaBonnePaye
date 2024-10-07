const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const path = require('path');
const { MongoClient } = require('mongodb');
const server = http.createServer(app);
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour le traitement des données de formulaire
app.use(express.urlencoded({ extended: true }));

const connectionString = process.env.MONGODB_URI;
const client = new MongoClient(connectionString);
const dbName = process.env.MONGODB_DBNAME;

let db;
async function connectDB() {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log('Connecté à la base de données MongoDB');
    } catch (err) {
        console.error('Erreur de connexion à la base de données :', err);
    }
}
connectDB();

app.get('/', (req, res) => {

    res.render('index');
});

app.post('/payement', async (req, res) => {
    console.log("Données reçues :", req.body); // Log des données reçues

    const payement = {
        name: req.body.name ,
        date: new Date(req.body.date), 
        description: req.body.description,
        somme: parseFloat(req.body.somme) 
    };

    console.log("Données avant insertion :", payement); // Log avant l'insertion

    try {
        const collection = db.collection(process.env.MONGODB_COLLECTION);
        await collection.insertOne(payement);
        console.log("Document inséré avec succès !");
        res.redirect('/?success=true'); // Redirection avec un paramètre de succès
    } catch (err) {
        console.error('Erreur lors de l\'ajout dU PAYEMENT :', err);
        res.status(500).send('Erreur lors de l\'ajout de la tâche');
    }
});

app.get('/total', async (req, res) => {
    try {
        const collection = db.collection(process.env.MONGODB_COLLECTION);

        // Agrégation pour grouper par 'name' et calculer la somme des 'somme'
        const result = await collection.aggregate([
            {
                $group: {
                    _id: "$name", // Grouper par le champ 'name'
                    totalSomme: { $sum: "$somme" } // Calculer la somme des champs 'somme'
                }
            }
        ]).toArray();

        console.log("Résultat de l'agrégation :", result);
        res.json(result); // Envoyer le résultat sous forme JSON
    } catch (err) {
        console.error('Erreur lors de l\'agrégation :', err);
        res.status(500).send('Erreur lors de la récupération des données');
    }
});

app.get('/historique/david', async (req, res) => {
    try {
        const collection = db.collection(process.env.MONGODB_COLLECTION);

        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

        // Récupérer tous les paiements de David pour le mois en cours
        const result = await collection.find({
            name: "David",
            date: {
                $gte: startOfMonth,
                $lt: endOfMonth
            }
        }).toArray();

        console.log("Historique des paiements de David pour le mois en cours :", result);
        res.json(result); // Envoyer tous les paiements sous forme JSON
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'historique :', err);
        res.status(500).send('Erreur lors de la récupération des données');
    }
});

app.get('/historique/lola', async (req, res) => {
    try {
        const collection = db.collection(process.env.MONGODB_COLLECTION);

        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

        // Récupérer tous les paiements de David pour le mois en cours
        const result = await collection.find({
            name: "Lola",
            date: {
                $gte: startOfMonth,
                $lt: endOfMonth
            }
        }).toArray();

        console.log("Historique des paiements de David pour le mois en cours :", result);
        res.json(result); // Envoyer tous les paiements sous forme JSON
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'historique :', err);
        res.status(500).send('Erreur lors de la récupération des données');
    }
});

app.listen(port, () => {
    console.log(`Serveur lancé sur le port : ${port}`);
});
