import express from 'express';
import path from 'path';
import pool from './database/db.js';


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

app.get("/edit-events", (req, res) => {
    res.sendFile("editEvents.html", { root: staticHTMLPath });
});

// This endpoint will handle fetching events from the database.
app.get('/api/events', (req, res) => {

    // Create the events table if it doesn't exist
    pool.query('Select * from events')
        .then((result) => {
            res.json(result.rows); // Send the fetched events as JSON response;
        })
        .catch(err => {
            console.error('Database connection error:', err);
        })
});

// This endpoint will handle adding new events to the database.
/* app.post('/api/events', (req, res) => {
    console.log('Adding new event\n');
    const { eventName, eventDate, eventLocation } = req.body;

    pool.query('INSERT INTO events (name, date, location) VALUES ($1, $2, $3)', [eventName, eventDate, eventLocation])
        .then(() => {
            console.log('Event added successfully\n');
            res.status(201).json({ message: 'Event added successfully' }); // Created status
        }).catch(err => {
            console.error('Error adding event:', err);
            res.status(500).json({ error: 'Failed to add event' });
        });
}); */
app.post('/api/events', (req, res) => {
    console.log('Adding new event\n');
    const { eventName, eventDate, eventLocation } = req.body;

    console.log('Received eventDate:', eventDate);
    console.log('Type of eventDate:', typeof eventDate);

    pool.query('INSERT INTO events (name, date, location) VALUES ($1, $2::timestamp, $3)', [eventName, eventDate, eventLocation])
        .then(() => pool.query("SELECT column_name, data_type, datetime_precision FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'date'"))
        .then(result => {
            console.log('Date column metadata:', result.rows[0]);
        })
        .then(() => {
            console.log('Event added successfully\n');

            // Query back the just-inserted event to see what was actually stored
            return pool.query('SELECT * FROM events WHERE name = $1 ORDER BY id DESC LIMIT 1', [eventName]);
        })
        .then(result => {
            console.log('Retrieved from DB:', result.rows[0]);
            res.status(201).json({ message: 'Event added successfully' });
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

    pool.query('DELETE FROM events WHERE id = $1', [eventId])
        .then(() => {
            res.status(204).send(); // No content to send back
        }).catch(err => {
            console.error('Error deleting event:', err);
            res.status(500).json({ error: 'Failed to delete event' });
        });
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\n`);
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

process.on('SIGINT', async () => {  // Ctrl+C
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