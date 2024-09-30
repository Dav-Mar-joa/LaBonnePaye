const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const path = require('path');
const { MongoClient } = require('mongodb')
const server = http.createServer(app);
require('dotenv').config();


app.use(express.static(path.join(__dirname, 'public')));

// Définir Pug comme moteur de vue
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectionString = process.env.MONGODB_URI;


const client = new MongoClient(connectionString);
const dbName = process.env.mongodb_dbname;

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

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});