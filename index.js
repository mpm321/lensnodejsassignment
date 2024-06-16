const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'userdb'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// JWT secret key
const jwtSecret = 'testing';

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// User registration
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).send('All fields are required');
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).send('Error registering user');
        }
        res.status(201).send('User registered');
    });
});

// User login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('All fields are required');
    }
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).send('Error logging in');
        }
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }
        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send('Invalid password');
        }
        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
        res.status(200).send({ auth: true, token });
    });
});

// User logout
app.post('/logout', (req, res) => {
    res.status(200).send({ auth: false, token: null });
});

// Get user profile
app.get('/profile', authenticateJWT, (req, res) => {
    const userId = req.user.id;
    const sql = 'SELECT id, username, email FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching user profile');
        }
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(results[0]);
    });
});

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
