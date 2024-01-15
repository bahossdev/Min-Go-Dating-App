// Get the user id
const userId = document.cookie
  .split('; ')
  .find(row => row.startsWith('user_id='))
  .split('=')[1];

// Function to add interest to the user
const addInterest = async (interestId, button) => {
  try {
    const response = await fetch(`/api/interests/${interestId}`, {
      method: 'PUT',
      body: JSON.stringify({ users: userId }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    document.location.replace(`/api/interests/${interestId}`);
        button.classList.add('active');

  } catch (error) {
    console.error('Add Interest Error:', error);
    alert('There was an error processing your request.');
  }
};

// Function to remove interest from the user
const removeInterest = async (interestId, button) => {
  try {
    const response = await fetch(`/api/interests/${interestId}/remove`, {
      method: 'DELETE',
      body: JSON.stringify({ users: userId }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    // Manually update the button's active status
    button.classList.remove('active');

  } catch (error) {
    console.error('Remove Interest Error:', error);
    alert('There was an error processing your request.');
  }
};

// Event listener for the heart button
document.querySelector('.heart-button').addEventListener('click', async (event) => {
  event.preventDefault();
  const button = event.target;
  const interestId = button.getAttribute('data-interest-id');

  // Get the current active state
  const isActive = button.classList.contains('active');

  if (isActive) {
    // If already active, remove the interest
    await removeInterest(interestId, button);
  } else {
    // If not active, add the interest
    await addInterest(interestId, button);
  }
});
