
const createInterest = async (event) => {
    event.preventDefault();
    console.log('clicked');
  
    const interest_name = document.getElementById('interest_name').value.trim();
  
    const formData = new FormData();
    formData.append('interest_name', interest_name);
    formData.append('interest', document.querySelector('[name="interest"]').files[0]);
  
    const response = await fetch('/api/interests/', {
      method: 'POST',
      body: formData,
    });
  
    if (response.ok) {
      console.log('Interest successfully created:', response);
      document.location.replace('/api/interests');
    } else {
      alert(`Failed to create interest. Status: ${response.status}, Message: ${response.statusText}`);
    }
  };
  
  document.getElementById('interest-form').addEventListener('submit', createInterest);