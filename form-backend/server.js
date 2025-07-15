const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // replaces body-parser

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root@123456$',
    database: 'formdb'
});

db.connect((err) => {
    if (err) {
        console.error('❌ MySQL connection error:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to MySQL!');
});

// Route to handle form submission
app.post('/submit', (req, res) => {
    const { name, email, phone, address, age  } = req.body;

    // Basic input validation
    if (!name || !email || !phone || !address || !age  ) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    console.log('📩 Received form data:', req.body);

    const sql = 'INSERT INTO contact (name, email, phone, address, age) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, phone, address, age, ], (err, result) => {
        if (err) {
            console.error('❌ Insert error:', err.message);
            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        }

        console.log('✅ Data inserted:', result.insertId);
        res.status(200).json({ message: 'Form submitted successfully!' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});
