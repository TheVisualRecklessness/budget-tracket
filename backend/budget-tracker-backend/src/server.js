import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser"

const isProduction = false;

const clearCookieConfig = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
}

const setCookieConfig = {
    ...clearCookieConfig,
    maxAge: 3 * 24 * 60 * 60 * 1000
}


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware setup
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Middleware for hashing passwords during registration
app.use((req, res, next) => {
    if (req.body) {
        if (req.body.password && req.path === '/register' && req.method === 'POST') {
            const hashedPassword = bcrypt.hashSync(req.body.password, 10);
            req.body.password = hashedPassword;
        }
    }
    next();
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    // console.log(req.headers)
    const token = req.cookies.userIdToken;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = user;
        next();
    });
};

// Routes
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    db.run('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [username, email, password], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error creating user', message: err.message });
        }
        res.status(201).json({ message: 'User created successfully' });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM user WHERE name = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching user', message: err.message });
        }
        if (!row || !bcrypt.compareSync(password, row.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const userIdToken = jwt.sign({ id: row.id }, JWT_SECRET, { expiresIn: '72h' });
        res.cookie('userIdToken', userIdToken, setCookieConfig);
        let name = row.name;
        name = name.charAt(0).toUpperCase() + name.slice(1);
        res.status(200).json({ message: `Gusto de verte de nuevo, ${name}` });
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('userIdToken', clearCookieConfig);
    res.status(200).json({ message: 'Logout successful' });
});

app.get('/check-authentication', authenticateToken, (req, res) => {
    const userId = req.user.id;

    db.get('SELECT name FROM user WHERE id = ?', [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error authenticating user', message: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User authenticated', id: `user id: ${userId}` });
    });
});

app.get('/get-name', authenticateToken, (req, res) => {
    const userId = req.user.id;

    db.get('SELECT name FROM user WHERE id = ?', [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving user', message: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User obtained', name: row.name });
    });
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
