const signupFormHandler = async (event) => {
  event.preventDefault();
  console.log('---Hey!---');
  const first_name = document.querySelector('#first_name-signup').value.trim();
  const last_name = document.querySelector('#last_name-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();
  const age = document.querySelector('#age').value;
  const gender = document.querySelector('#gender').value;
  const location = document.querySelector('#location').value;
  const status = document.querySelector('#status').value;
  const education = document.querySelector('#education').value;

  if (first_name && email && password && age && gender && location) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(
        { first_name, last_name, email, password, age, gender, location, status, education }
      ),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      document.location.replace('/');

    } else {
      alert(response.statusText);
    }
  }
};

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);
