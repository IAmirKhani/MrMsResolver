// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('name-form');
  const nameInput = document.getElementById('name');
  const predictionDiv = document.getElementById('prediction');
  const savedAnswerDiv = document.getElementById('saved-answer');
  const clearButton = document.getElementById('clear');
  
  // Handle form submission
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = nameInput.value.trim();
    if (name && /^[A-Za-z ]+$/.test(name)) { // Check for valid input
      fetchGenderPrediction(name);
    } else {
      alert('Please enter a valid name.');
    }
  });
  
  // Save the user-selected gender
  document.getElementById('save').addEventListener('click', function() {
    const selectedGender = document.querySelector('input[name="gender"]:checked')?.value;
    if (selectedGender) {
      localStorage.setItem(nameInput.value.trim(), selectedGender);
      showSavedAnswer(nameInput.value.trim(), selectedGender);
    }
  });
  
  // Clear the saved gender from local storage
  clearButton.addEventListener('click', function() {
    const name = nameInput.value.trim();
    localStorage.removeItem(name);
    savedAnswerDiv.style.display = 'none';
  });
  
  // Fetch the gender prediction from the API
  function fetchGenderPrediction(name) {
    fetch(`https://api.genderize.io/?name=${encodeURIComponent(name)}`)
      .then(response => response.json())
      .then(data => {
        displayPrediction(data);
        checkLocalStorage(name);
      })
      .catch(error => {
        console.error('Error with Genderize.io API:', error);
      });
  }
  
  // Display the gender prediction
  function displayPrediction(data) {
    predictionDiv.innerHTML = `<strong>Prediction</strong><p>${data.gender} ${data.probability}</p>`;
  }
  
  // Show the saved answer for the given name
  function showSavedAnswer(name, gender) {
    savedAnswerDiv.style.display = 'block';
    savedAnswerDiv.innerHTML = `<strong>Saved Answer</strong><p>${gender}</p>`;
  }
  
  // Check if there's a saved answer in local storage
  function checkLocalStorage(name) {
    const savedGender = localStorage.getItem(name);
    if (savedGender) {
      showSavedAnswer(name, savedGender);
    } else {
      savedAnswerDiv.style.display = 'none';
    }
  }
});
