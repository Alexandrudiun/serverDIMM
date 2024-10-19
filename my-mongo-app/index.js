const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Configurare Express
const app = express();
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Conexiune la MongoDB
const uri = 'mongodb+srv://alex:alex@cluster0.x2rho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0e';

mongoose.connect(uri)
    .then(() => console.log('Conexiune reușită la MongoDB'))
    .catch(err => console.error('Eroare la conectare:', err));

// Schema pentru obiect
const ObjectSchema = new mongoose.Schema({
    nume: String,
    team: String,
    latitudine: Number,
    longitudine: Number,
    mesajalerta: String,
    datacreare: { type: Date, default: Date.now },
    datataUltimuluiUpdate: { type: Date, default: Date.now }
});

// Modelul Mongoose
const ObjectModel = mongoose.model('Object', ObjectSchema);

// Ruta pentru înregistrare
app.post('/register', async (req, res) => {
    const { nume, team, latitudine, longitudine, mesajalerta } = req.body;
    
    const newObject = new ObjectModel({
        nume,
        team,
        latitudine,
        longitudine,
        mesajalerta,
    });
    
    try {
        const savedObject = await newObject.save();
        
        // Răspuns personalizat cu ID-ul obiectului salvat
        res.status(201).json({
            message: 'successfully',
            id: savedObject._id, 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta pentru actualizare
app.put('/update/:id', async (req, res) => {
    const { mesajalerta, latitudine, longitudine } = req.body;
    
    try {
        const updatedObject = await ObjectModel.findByIdAndUpdate(
            req.params.id,
            { mesajalerta, latitudine, longitudine, datataUltimuluiUpdate: Date.now() },
            { new: true }
        );
        
        if (!updatedObject) return res.status(404).send('Obiectul nu a fost găsit');
        res.json(updatedObject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta pentru a obține un obiect după ID
app.get('/get/:id', async (req, res) => {
    try {
        const object = await ObjectModel.findById(req.params.id);
        if (!object) return res.status(404).send('Obiectul nu a fost găsit');
        res.json(object);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta pentru a obține toate obiectele
app.get('/getall', async (req, res) => {
    try {
        const objects = await ObjectModel.find();
        res.json(objects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Pornirea serverului
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serverul rulează pe portul ${PORT}`);
});