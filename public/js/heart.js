// Get the user id
const userId = document.cookie
  .split('; ')
  .find(row => row.startsWith('user_id='))
  .split('=')[1];

// function to add or remove interest from the user
const toggleHeart = async (event) => {
  event.preventDefault();
  const button = event.target;

  // Get the interest id from the clicked button
  const interestId = button.getAttribute('data-interest-id');
  const isActive = button.classList.contains('active');
  // button.classList.toggle('active');
  
  // Determine the action based on the current state
  const action = isActive ? 'remove' : 'add';
  
  try {
    let url;
    
    if (action === 'remove') {
      url = `/api/interests/${interestId}/remove`;
    } else {
      url = `/api/interests/${interestId}`;
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
      document.location.replace(`/api/interests/${interestId}`);
      console.log(action);
  } else {
      alert(response.statusText);
  }
 
  } catch (error) {
    console.error('Toggle Heart Error:', error);
    alert('There was an error processing your request.');
  }
};

document.querySelector('.heart-button').addEventListener('click', toggleHeart);
