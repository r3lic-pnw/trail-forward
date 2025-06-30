// events.js
// This file will handle fetching and displaying events for the Events page.

// This fetches events from the server and displays them on the Events page.
document.addEventListener('DOMContentLoaded', async () => {
    const events = await fetchEvents();
    console.log('Fetched events:', events);

    if (events) {
        displayEvents(events);
    }
});


// This function will display the events in the Upcoming and Past Events sections.
function displayEvents(events) {
    const upcomingEventsList = document.getElementById('upcoming-events-list');
    const pastEventsList = document.getElementById('past-events-list');

    // Clear previous event lists
    upcomingEventsList.innerHTML = '';
    pastEventsList.innerHTML = '';

    if (events && events.length > 0) {
        events
            .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort events oldest to newest
            .forEach(event => {
                const eventItem = document.createElement('li');
                eventItem.textContent = `${event.name} - ${new Date(event.date).toLocaleDateString()} at ${event.location}`;
                eventItem.id = event.id; // Set the ID for easy deletion
                eventItem.classList.add('event-item');

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteEvent(event.id));

                eventItem.appendChild(deleteButton);

                // Append the event item to the appropriate list based on the date
                if (new Date(event.date) > new Date()) {
                    upcomingEventsList.appendChild(eventItem);
                } else {
                    pastEventsList.appendChild(eventItem);
                }
            });
    } else {
        upcomingEventsList.innerHTML = '<li>No upcoming events found.</li>';
        pastEventsList.innerHTML = '<li>No past events found.</li>';
    }
}
