import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookie from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;
const JWT_SECRET = process.env.JWT_SECRET


const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
));

// Middlewares
app.use((req, res, next) => {
    if (req.body) {
        if (req.body.password && req.path === '/register' && req.method === 'POST') {
            const hashedPassword = bcrypt.hashSync(req.body.password, 10);
            req.body.password = hashedPassword;
        }
    }
    next();
});

const authenticateToken = (req, res, next) => {
    const token = req.cookies.userIdToken;

    // const token = req.cookies.userIdToken;
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
}

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    db.run('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [username, email, password], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error creating user', message: err.message });
        }
        res.status(201).json({ message: 'User created successfully' });
    });

})

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
        res.cookie('userIdToken', userIdToken, { httpOnly: true });
        let name = row.name
        name = name.charAt(0).toUpperCase() + name.slice(1);
        res.status(200).json({ message: `Gusto de verte de nuevo, ${name}`});
    });
})

app.post('/logout', (req, res) => {
    res.clearCookie('userIdToken', { httpOnly: true })
    res.status(200).json({ message: 'Logout successful' })

});

app.get('/some-user', authenticateToken, (req, res) => {
    const userId = req.user.id;
    console.log(req)
    db.get('SELECT * FROM user WHERE id = ?', [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching user', message: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(row);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});