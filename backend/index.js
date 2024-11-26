const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Apply CORS with specific origin
app.use(cors({
    origin: 'https://userdatabase-five.vercel.app',  // Specify the frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Allow headers
}));

// Handle preflight requests (This should be fine with app.use(cors()))
app.options('*', cors());

// JSON middleware
app.use(express.json());


// MongoDB Connection
const MONGO_URI = 'mongodb+srv://meemmateen:meemmateen@cluster0.sx3id.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB URI
mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000 // Adjust timeout as needed
});

// Define a User Schema
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile_number: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

// Create a User Model
const User = mongoose.model('User', userSchema);

// Add a user
app.post('/api/data', async (req, res) => {
    const { first_name, email, mobile_number } = req.body;
    try {
        const user = new User({ first_name, email, mobile_number });
        await user.save();
        res.status(201).send('Data added successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Fetch all users
app.get('/api/data', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update a user by ID
app.put('/api/data/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, email, mobile_number } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            id,
            { first_name, email, mobile_number },
            { new: true, runValidators: true }
        );
        if (!user) return res.status(404).send('User not found');
        res.send('User updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating data');
    }
});

// Delete a user by ID
app.delete('/api/data/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).send('User not found');
        res.send('User deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting user');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
