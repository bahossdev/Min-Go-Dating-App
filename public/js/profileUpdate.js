const showForm = async (event) => {
  event.preventDefault();
  // console.log('clicked!')
  // console.log(document.cookie);
  const form = document.querySelector('#update-form')
  form.style.display = (form.style.display === 'none') ? 'block' : 'none';
}

document.getElementById('edit').addEventListener('click', showForm);

const updateFormHandler = async (event) => {
  event.preventDefault();
  //retrieve:
  const userId = document.cookie
    .split('; ')
    .find(row => row.startsWith('user_id='))
    .split('=')[1];

// const savedInfo = await fetch(`/api/users/${userId}`);
// if(!savedInfo.ok) {
//   alert('Failed to retrieve user data for editing');
//   return;
// }
//   const userData = await savedInfo.json();
//   document.querySelector('#first-name').value = userData.first_name;
//   document.querySelector('#last-name').value = userData.last_name;
//   document.querySelector('#age').value = userData.age;
//   document.querySelector('#gender').value = userData.gender;
//   document.querySelector('#location').value = userData.location;
//   document.querySelector('#status').value = userData.status;
//   document.querySelector('#education').value = userData.education;

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
  };
};

document
  .querySelector('.update-user-form')
  .addEventListener('submit', updateFormHandler);
