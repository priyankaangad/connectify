const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'connectify'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// User Registration
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (result.length > 0) {
            return res.status(400).send('User already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
            if (err) throw err;
            res.send('User registered successfully');
        });
    });
});

// User Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (result.length === 0) {
            return res.status(400).send('Invalid email or password');
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, result[0].password);
        if (!validPassword) {
            return res.status(400).send('Invalid email or password');
        }

        // Generate a token
        const token = jwt.sign({ id: result[0].id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
