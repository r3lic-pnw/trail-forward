// This file will handle fetching and displaying events for the Events page.
import { fetchEvents, displayEvents } from './api/eventsAPI.js';


// This fetches events from the server and displays them on the Events page.
document.addEventListener('DOMContentLoaded', async () => {
    const events = await fetchEvents();
    console.log('Fetched events:', events);

    if (events) {
        displayEvents(events);
    }
});
