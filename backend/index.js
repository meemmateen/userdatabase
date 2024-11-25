const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost', // Replace with your host
    user: 'root',      // Replace with your database username
    password: '',      // Replace with your database password
    database: 'users'  // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Add a user
app.post('/api/data', (req, res) => {
    const { first_name, email, mobile_number } = req.body;

    const sql = 'INSERT INTO users (first_name, email, mobile_number) VALUES (?, ?, ?)';
    db.query(sql, [first_name, email, mobile_number], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
            return;
        }
        res.status(201).send('Data added successfully!');
    });
});

// Fetch all users
app.get('/api/data', (req, res) => {
    const sql = 'SELECT id, first_name, email, mobile_number, created_at FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

// Update a user by ID
app.put('/api/data/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, email, mobile_number } = req.body;

    const query = `
        UPDATE users 
        SET first_name = ?, email = ?, mobile_number = ? 
        WHERE id = ?
    `;
    db.query(query, [first_name, email, mobile_number, id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating data');
        } else {
            res.send('User updated successfully');
        }
    });
});

// Delete a user by ID
app.delete('/api/data/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM users WHERE id = ?`;
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting user');
        } else {
            res.send('User deleted successfully');
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});