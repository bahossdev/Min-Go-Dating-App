// Reference to the currently displayed form
let currentForm = null;

//get the user id
const userId = document.cookie
  .split('; ')
  .find(row => row.startsWith('user_id='))
  .split('=')[1];

// function to show update form
const showForm = async (event) => {
  event.preventDefault();

  // Hide the current form if exists
  if (currentForm) {
    currentForm.style.display = 'none';
  }

  // Retrieve saved user info:
  const userResponse = await fetch(`/api/users/${userId}/update`);
  const userData = await userResponse.json();

  // Update form fields
  document.querySelector('#first-name').value = userData.first_name;
  document.querySelector('#last-name').value = userData.last_name;
  document.querySelector('#age').value = userData.age;
  document.querySelector('#gender').value = userData.gender;
  document.querySelector('#location').value = userData.location;
  document.querySelector('#status').value = userData.status;
  document.querySelector('#education').value = userData.education;

  // Display the update form
  const form = document.querySelector('#update-form');
  form.style.display = 'block';

  // Set the current form reference
  currentForm = form;
};

// function to show upload pic form
const showPicForm = async (event) => {
  event.preventDefault();

  // Hide the current form if exists
  if (currentForm) {
    currentForm.style.display = 'none';
  }

  const picForm = document.querySelector('#upload-pic');
  picForm.style.display = 'block';

  // Set the current form reference
  currentForm = picForm;
};

// function to update user info
const updateFormHandler = async (event) => {
  event.preventDefault();
  const first_name = document.querySelector('#first-name').value.trim();
  const last_name = document.querySelector('#last-name').value.trim();
  const age = document.querySelector('#age').value;
  const gender = document.querySelector('#gender').value;
  const location = document.querySelector('#location').value;
  const status = document.querySelector('#status').value;
  const education = document.querySelector('#education').value;

  const response = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(
      { first_name, last_name, age, gender, location, status, education }
    ),
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/profile');
  } else {
    alert(response.statusText);
  }
};


document.getElementById('edit').addEventListener('click', showForm);

document.getElementById('upload-pic-btn').addEventListener('click', showPicForm);

document.querySelector('.update-user-form').addEventListener('submit', updateFormHandler);
