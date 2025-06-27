import express from 'express';
import path from 'path';
import client from './database/db.js';


const staticFilesPath = path.join(process.cwd(), 'public');
const staticHTMLPath = path.join(staticFilesPath, 'html');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(staticFilesPath));
app.use(express.static(staticHTMLPath));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.get('/', (req, res) => {
    res.sendFile("index.html");
});

app.get('/events', (req, res) => {
    res.sendFile("events.html", { root: staticHTMLPath });
});

app.get('/api/events', (req, res) => {
    // This endpoint will handle fetching events from the database.
    console.log('Database connection test endpoint');
    client.connect()
        .then(async () => {
            console.log('Connected to the database');
            await client.query('CREATE TABLE IF NOT EXISTS events (id SERIAL PRIMARY KEY, name VARCHAR(100), date DATE, location VARCHAR(100))');
            console.log('Test table created or already exists');
        }).then(async () => {
            return await client.query('SELECT * FROM events');
        }).then((result) => {
            res.json(result.rows); // Send the fetched events as JSON response;
        }).catch(err => {
            console.error('Database connection error:', err);
        })
});

app.post('/api/events', (req, res) => {
    // This endpoint will handle adding new events to the database.
    console.log('Adding new event');
    const { eventName, eventDate, eventLocation } = req.body;
    client.connect()
        .then(() => {
            return client.query('INSERT INTO events (name, date, location) VALUES ($1, $2, $3)', [eventName, eventDate, eventLocation]);
        }).then(() => {
            res.status(201).json({ message: 'Event added successfully' });
        }).catch(err => {
            console.error('Error adding event:', err);
            res.status(500).json({ error: 'Failed to add event' });
        });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});