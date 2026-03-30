const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => {
        console.log("-----------------------------------------");
        console.log("✅ SRI DORASANI DATABASE CONNECTED!");
        console.log("-----------------------------------------");
    })
    .catch((err) => {
        console.log("❌ DATABASE CONNECTION ERROR:", err.message);
    });

// --- 1. SAREE MODEL (The Blueprint) ---
const SareeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: String,       // e.g., "Silk", "Cotton"
    stockStatus: String,    // e.g., "In Stock", "Out of Stock"
    imageUrl: String,       // Link to the saree photo
    description: String,
    dateAdded: { type: Date, default: Date.now }
});

const Saree = mongoose.model('Saree', SareeSchema);

// --- 2. ROUTES (The Bridge) ---

// POST: Admin Portal calls this to ADD a new saree
app.post('/api/sarees', async (req, res) => {
    try {
        const newSaree = new Saree(req.body);
        const savedSaree = await newSaree.save();
        res.status(201).json(savedSaree);
    } catch (err) {
        res.status(400).json({ error: "Failed to add saree", details: err.message });
    }
});

// GET: Customer Website calls this to VIEW all sarees
app.get('/api/sarees', async (req, res) => {
    try {
        const allSarees = await Saree.find().sort({ dateAdded: -1 }); // Newest first
        res.json(allSarees);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch sarees" });
    }
});

// DELETE: Admin can remove a product
app.delete('/api/sarees/:id', async (req, res) => {
    try {
        await Saree.findByIdAndDelete(req.params.id);
        res.json({ message: "Saree deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

// Default Root Route
app.get('/', (req, res) => {
    res.send("Sri Dorasani API is Live!");
});

// Port Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is live on http://localhost:${PORT}`);
});

// PUT: Admin can update a saree
app.put('/api/sarees/:id', async (req, res) => {
    try {
        const updatedSaree = await Saree.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedSaree) {
            return res.status(404).json({ error: "Saree not found" });
        }

        res.json(updatedSaree);

    } catch (err) {
        res.status(400).json({ error: "Update failed", details: err.message });
    }
});