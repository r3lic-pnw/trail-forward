// This file contains functions to fetch, display, create, and delete events.
// It is used in both the Events page and the Edit Events page.

// This fetches events from the server and displays them on the Events page.
export async function fetchEvents() {
    try {
        const response = await fetch('/api/events');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching events:', error);
        return null;
    }
}

// This function will display the events in the Upcoming and Past Events sections.
export function displayEvents(events) {
    const upcomingEventsList = document.getElementById('upcoming-events-list');
    const pastEventsList = document.getElementById('past-events-list');

    // Clear previous event lists
    upcomingEventsList.innerHTML = '';
    pastEventsList.innerHTML = '';

    if (events && events.length > 0) {
        events
            .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort events oldest to newest
            .forEach(event => {
                // Create a list item for each event
                const eventItem = document.createElement('li');
                eventItem.id = event.id; // Set the ID for easy deletion
                eventItem.classList.add('event-item');

                // Create a link for the event name
                const eventLocationLink = makeLocationLink(event.location, event.name);
                eventItem.appendChild(eventLocationLink);
                eventItem.innerHTML += ` - ${new Date(event.date).toLocaleString()}`;

                // Only show the delete button if the user is on the Edit Events page

                if (window.location.pathname.includes("edit-events")) {
                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('delete-button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => deleteEvent(event.id));

                    eventItem.appendChild(deleteButton);
                }

                // Append the event item to the appropriate list based on the date
                if (new Date(event.date) >= new Date()) {
                    upcomingEventsList.appendChild(eventItem);
                } else {
                    pastEventsList.appendChild(eventItem);
                }

                if (upcomingEventsList.children.length === 0) {
                    upcomingEventsList.innerHTML = '<li>No upcoming events found.</li>';
                } else if (pastEventsList.children.length === 0) {
                    pastEventsList.innerHTML = '<li>No past events found.</li>';
                }
            });
    } else {
        upcomingEventsList.innerHTML = '<li>No upcoming events found.</li>';
        pastEventsList.innerHTML = '<li>No past events found.</li>';
    }
}

// This function will handle the form submission to add a new event.
export async function createEvent(event) {
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


// This function will handle deleting an event.
export function deleteEvent(eventId) {
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

// This function creates a link to the event location.
// It will open the location in the appropriate maps app based on the user's device.
function makeLocationLink(location, name) {
    const encodedLocation = encodeURIComponent(location);
    const link = document.createElement('a');

    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        // iOS - try Google Maps app first, fallback to Apple Maps
        link.href = `comgooglemaps://?q=${encodedLocation}`;
    } else if (/Android/.test(navigator.userAgent)) {
        // Android - open Google Maps
        link.href = `geo:0,0?q=${encodedLocation}`;
    } else {
        // Desktop - open in browser
        link.href = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    }
    link.textContent = name;
    return link;
}