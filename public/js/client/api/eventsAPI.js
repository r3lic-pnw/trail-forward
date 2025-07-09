/**
 * This fetches events from the server and returns them.
 *
 * @returns {Promise<Array<Event>>} A promise that resolves to an array of events.
 */
export async function fetchEvents() {
    try {
        const response = await fetch('/api/events');
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching events:', error);
        return null;
    }
}
/**
 * This function will display the events in the Upcoming and Past Events sections.
 *
 * It sorts the events by date, displaying upcoming events in one list and past events in another.
 *
 * If null, it will display a message indicating no events found.
 *
 * @param {Array<Event> | null} events - The list of events to display.
 *
 * @returns {void}
 */
export function displayEvents(events) {
    const upcomingEventsList = document.getElementById('upcoming-events-list');
    const pastEventsList = document.getElementById('past-events-list');
    if (!upcomingEventsList || !pastEventsList) {
        console.error('Upcoming or Past Events list elements not found.');
        return;
    }
    // Clear previous event lists
    upcomingEventsList.innerHTML = '';
    pastEventsList.innerHTML = '';
    if (events && events.length > 0) {
        events
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort events oldest to newest
            .forEach(event => {
            // Create a list item for each event
            const eventItem = document.createElement('li');
            eventItem.id = event.id.toString(); // Set the ID for easy deletion
            eventItem.classList.add('event-item');
            // Creates a link to the event location
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
            }
            else {
                pastEventsList.appendChild(eventItem);
            }
            if (upcomingEventsList.children.length === 0) {
                upcomingEventsList.innerHTML = '<li>No upcoming events found.</li>';
            }
            else if (pastEventsList.children.length === 0) {
                pastEventsList.innerHTML = '<li>No past events found.</li>';
            }
        });
    }
    else {
        upcomingEventsList.innerHTML = '<li>No upcoming events found.</li>';
        pastEventsList.innerHTML = '<li>No past events found.</li>';
    }
}
/**
 * This function will handle the form submission to add a new event.
 *
 * It will prevent the default form submission, gather the form data,
 * and send a POST request to the server to create the event.
 *
 * @param {Event} event
 *
 * @returns {Promise<void>}
 */
export async function createEvent(event) {
    event.preventDefault(); // Prevent the default form submission
    const form = event.target;
    const formData = new FormData(form);
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
            form.reset(); // Reset the form after successful submission
        }
        else {
            console.error('Error adding event:', response.statusText);
        }
    }).catch(error => {
        console.error('Error submitting event:', error);
    });
}
/**
 * This function will handle deleting an event.
 *
 * It will remove the event from the DOM and send a DELETE request to the server.
 *
 * @param eventId - The ID of the event to be deleted.
 *
 * @returns {void}
 */
export function deleteEvent(eventId) {
    console.log(`Delete event with ID: ${eventId}`);
    const deletedEventItem = document.querySelector(`li[id='${eventId}']`);
    if (deletedEventItem) {
        deletedEventItem.remove();
    }
    else {
        console.error('Event item not found for deletion');
    }
    fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
    });
}
/**
 * This function creates a link to the event location.
 *
 * It will open the location in the appropriate maps app based on the user's device.
 *
 * @param {string} location
 * @param {string} name
 * @returns {HTMLAnchorElement} The anchor element linking to the event location.
 * @example
 * makeLocationLink('1600 Amphitheatre Parkway, Mountain View, CA', 'Googleplex');
 * // => <a href='https://www.google.com/maps/search/?api=1&query=1600%20Amphitheatre%20Parkway%2C%20Mountain%20View%2C%20CA'>Googleplex</a>
 */
function makeLocationLink(location, name) {
    const encodedLocation = encodeURIComponent(location);
    const link = document.createElement('a');
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        // iOS - try Google Maps app first, fallback to Apple Maps
        link.href = `comgooglemaps://?q=${encodedLocation}`;
    }
    else if (/Android/.test(navigator.userAgent)) {
        // Android - open Google Maps
        link.href = `geo:0,0?q=${encodedLocation}`;
    }
    else {
        // Desktop - open in browser
        link.href = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    }
    link.textContent = name;
    return link;
}
