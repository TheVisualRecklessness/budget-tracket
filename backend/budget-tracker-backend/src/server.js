import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = process.env.PORT || 4000;

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
        origin: 'http://localhost:3000'
    }
));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});