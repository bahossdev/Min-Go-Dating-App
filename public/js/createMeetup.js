const showMeetupForm = async (event) => {
  event.preventDefault();
  const meetupForm = document.querySelector('#meetup-form')
  meetupForm.style.display = (meetupForm.style.display === 'none') ? 'block' : 'none';
}

document.getElementById('new-meetup').addEventListener('click', showMeetupForm);

const createMeetup = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#title').value.trim();
  const description = document.querySelector('#description').value.trim();
  const date = document.querySelector('#date').value;
  const time = document.querySelector('#time').value;
  const location = document.querySelector('#meet-location').value.trim();
  const in_person = document.querySelector('#in_person').value;

  const owner_id = document.cookie
    .split('; ')
    .find(row => row.startsWith('user_id='))
    .split('=')[1];
  const users = owner_id;

  const response = await fetch('/api/meetups/', {
    method: 'POST',
    body: JSON.stringify({
      title,
      description,
      date,
      time,
      location,
      in_person,
      owner_id,
      users
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.ok) {
    const meetup = await response.json();
    console.log('Meetup successfully created:', response, meetup);
  document.location.replace('/profile');

  } else {
    alert(`Failed to create meetup. Status: ${response.status}, Message: ${response.statusText}`)
  };
};

document
  .querySelector('.meetup-form')
  .addEventListener('submit', createMeetup);
