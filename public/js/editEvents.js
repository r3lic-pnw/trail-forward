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
                eventItem.textContent = `${event.name} - ${new Date(event.date).toLocaleString()} at ${event.location}`;
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

async function createEvent(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);
    const eventData = Object.fromEntries(formData);
    console.log('Event data to be submitted:', eventData);

    fetch('/api/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    }).then(async (response) => {
        if (response.status === 201) {
            const events = await fetchEvents(); // refetch events after adding a new one
            displayEvents(events); // display the updated list of events
            event.target.reset(); // Reset the form after successful submission
        } else {
            console.error('Error adding event:', response.statusText);
        }
    }).catch(error => {
        console.error('Error submitting event:', error);
    });
}


function deleteEvent(eventId) {
    // This function will handle deleting an event.
    console.log(`Delete event with ID: ${eventId}`);

    const deletedEventItem = document.querySelector(`li[id='${eventId}']`);
    if (deletedEventItem) {
        deletedEventItem.remove();
    } else {
        console.error('Event item not found for deletion');
    }

    fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
    });
}