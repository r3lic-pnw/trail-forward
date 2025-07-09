import { fetchEvents, createEvent, displayEvents } from './api/eventsAPI.js';
// This fetches events from the server and displays them on the Events page.
document.addEventListener('DOMContentLoaded', async () => {
    const events = await fetchEvents();
    console.log('Fetched events:', events);
    if (events) {
        displayEvents(events);
    }
});
// Event listener for the form submission to add a new event
// This will send a POST request to the server to add the event.
document.getElementById('event-form').addEventListener('submit', createEvent);
