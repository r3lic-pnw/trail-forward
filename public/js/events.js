// events.js
// This file will handle fetching and displaying events for the Events page.

document.addEventListener('DOMContentLoaded', async () => {
    const events = await fetchEvents();
    console.log('Fetched events:', events);

    if (events) {
        displayEvents(events);
    }
});

async function fetchEvents() {
    try {
        const response = await fetch('/api/events');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching events:', error);
        return null;
    }
}

function displayEvents(events) {
    const eventsList = document.getElementById('event-list');
    eventsList.innerHTML = ''; // Clear existing content

    if (events && events.length > 0) {
        events.forEach(event => {
            const eventItem = document.createElement('li');
            eventItem.textContent = `${event.name} - ${new Date(event.date).toLocaleDateString()} at ${event.location}`;
            eventsList.appendChild(eventItem);
        });
    } else {
        eventsList.innerHTML = '<li>No events found.</li>';
    }
}