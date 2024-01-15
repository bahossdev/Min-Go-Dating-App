const showUpdateMeetupForm = async (event) => {
  event.preventDefault();
  const updateMeetupForm = document.querySelector('#update-meetup-form');
  updateMeetupForm.style.display = (updateMeetupForm.style.display === 'none') ? 'block' : 'none';

  // Hide the current form if exists
  if (currentForm) {
    currentForm.style.display = 'none';
  }

  // Set the current form reference
  currentForm = updateMeetupForm;
};


const updateMeetupHandler = async (event) => {
  event.preventDefault();

  const updatedTitle = document.querySelector('#update-title').value.trim();
  const updatedDescription = document.querySelector('#update-description').value.trim();
  const updatedDate = document.querySelector('#update-date').value;
  const updatedTime = document.querySelector('#update-time').value;
  const updatedLocation = document.querySelector('#update-meet-location').value.trim();
  const updatedInPerson = document.querySelector('#update-in_person').value;

  // const meetupId = /* Get the ID of the meetup you want to update */;

  const response = await fetch(`/api/meetups/${meetupId}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: updatedTitle,
      description: updatedDescription,
      date: updatedDate,
      time: updatedTime,
      location: updatedLocation,
      in_person: updatedInPerson
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/profile');
  } else {
    alert(`Failed to update meetup. Status: ${response.status}, Message: ${response.statusText}`)
  }
};

document.getElementById('update-meetup').addEventListener('click', showUpdateMeetupForm);

document
  .querySelector('.update-meetup-form')
  .addEventListener('submit', updateMeetupHandler);