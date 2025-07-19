import express from 'express';
import path from 'path';
import pool from './database/db.js';
import { readdir } from 'fs';
const staticFilesPath = path.join(process.cwd(), 'public');
const staticHTMLPath = path.join(process.cwd(), 'public', 'html');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(staticFilesPath)); // Serve static HTML files from the public/html directory
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.get('/', (req, res) => {
    res.sendFile("home.html", { root: staticHTMLPath });
});
app.get('/events', (req, res) => {
    res.sendFile("events.html", { root: staticHTMLPath });
});
app.get("/edit-events", (req, res) => {
    res.sendFile("editEvents.html", { root: staticHTMLPath });
});
app.get('/gallery', (req, res) => {
    res.sendFile("gallery.html", { root: staticHTMLPath });
});
// ********** API Endpoints **********
// This endpoint will handle fetching events from the database.
app.get('/api/events', (req, res) => {
    // Create the events table if it doesn't exist
    pool.execute('CREATE TABLE IF NOT EXISTS events (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), date DATETIME, location VARCHAR(100))')
        .then(() => pool.execute('SELECT * FROM events'))
        .then((result) => {
        res.json(result[0]); // Send the fetched events as JSON response
    })
        .catch(err => {
        console.error('Database connection error:', err);
        res.status(500).json({ error: 'Failed to fetch events' });
    });
});
// This endpoint will handle adding new events to the database.
app.post('/api/events', (req, res) => {
    console.log('Adding new event\n');
    const { eventName, eventDate, eventLocation } = req.body;
    console.log('Received eventDate:', eventDate);
    console.log('Type of eventDate:', typeof eventDate);
    pool.execute('INSERT INTO events (name, date, location) VALUES (?, ?, ?)', [eventName, eventDate, eventLocation])
        .then(() => {
        console.log('Event added successfully\n');
        return pool.execute('SELECT * FROM events WHERE name = ? ORDER BY id DESC LIMIT 1', [eventName]);
    })
        .then(result => {
        console.log('Retrieved from DB:', result[0]);
        res.status(201).send(); // Send a 201 Created response
    })
        .catch(err => {
        console.error('Error adding event:', err);
        res.status(500).json({ error: 'Failed to add event' });
    });
});
// This endpoint will handle deleting an event by ID.
app.delete('/api/events/:id', (req, res) => {
    const eventId = req.params.id;
    console.log(`Deleting event with ID: ${eventId}\n`);
    pool.execute('DELETE FROM events WHERE id = ?', [eventId])
        .then(result => {
        const header = result[0];
        if (header.affectedRows === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(204).send();
    }).catch(err => {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Failed to delete event' });
    });
});
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\n`);
});
// This endpoint will handle fetching images from the database.
// Returnss a list of image URLs from the server's static assets directory.
app.get("/api/gallery", (req, res) => {
    console.log('Fetching gallery images\n');
    const imagesDir = path.join(staticFilesPath, 'assets');
    readdir(imagesDir, (err, files) => {
        if (err) {
            console.error('Error reading images directory:', err);
            return res.status(500).json({ error: 'Failed to fetch gallery images' });
        }
        // Filter for image files (you can adjust the extensions as needed)
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        const imageURLs = imageFiles.map(file => `/assets/${file}`); // Create URLs for the images
        if (imageURLs.length === 0) {
            console.error('No images found in the gallery.');
            return res.status(404).json({ error: 'No images found' });
        }
        res.json(imageURLs); // Send the image URLs as JSON response
    });
});
// graceful shutdown for server and database pool
process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        pool.end().then(() => {
            console.log('Database pool closed');
            process.exit(0);
        });
    });
});
process.on('SIGINT', async () => {
    console.log('Received SIGINT, shutting down gracefully...');
    server.close(() => {
        pool.end().then(() => {
            console.log('Database pool closed');
            process.exit(0);
        });
    });
});
// For unhandled errors
process.on('uncaughtException', async (err) => {
    console.error('Uncaught exception:', err);
    server.close(() => {
        pool.end().then(() => {
            console.log('Database pool closed');
            process.exit(1);
        });
    });
});
