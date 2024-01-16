// Get the user id
const userId = document.cookie
  .split('; ')
  .find(row => row.startsWith('user_id='))
  .split('=')[1];

// function to add or remove meetup from the user
const toggleJoin = async (event) => {
  event.preventDefault();
  const button = event.target;
  const meetupId = button.getAttribute('data-meetup-id');
  const isActive = button.classList.contains('active');
  console.log(meetupId);

  const action = isActive ? 'remove' : 'add';
  
  try {
    let url;
    
    if (action === 'remove') {
      url = `/api/meetups/${meetupId}/remove`;
    } else {
      url = `/api/meetups/${meetupId}`;
    }

    const response = await fetch(url, {
      method: action === 'remove' ? 'DELETE' : 'PUT',
      body: JSON.stringify({ users: userId }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    if (response.ok) {
      document.location.replace(`/api/meetups/${meetupId}`);
      console.log(action);
  } else {
      alert(response.statusText);
  }
 
  } catch (error) {
    console.error('Toggle Join Error:', error);
    alert('There was an error processing your request.');
  }
};

document.querySelector('.join').addEventListener('click', toggleJoin);
