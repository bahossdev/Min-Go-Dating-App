const showForm = async (event) => {
  event.preventDefault();
  console.log('clicked!')
  const form = document.querySelector('#update-form')
  form.style.display = (form.style.display === 'none') ? 'block' : 'none';
}

document.getElementById('edit').addEventListener('click', showForm);

const updateFormHandler = async (event) => {
  event.preventDefault();
  // console.log('---Hey!---');
  const userId = document.querySelector('#user-id').value;
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
      // await fetch('/api/users/login', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, password }),
      //   headers: { 'Content-Type': 'application/json' },
      // });

      document.location.replace('/profile');

    } else {
      alert(response.statusText);
    };
  };




document
  .querySelector('.update-user-form')
  .addEventListener('submit', updateFormHandler);
