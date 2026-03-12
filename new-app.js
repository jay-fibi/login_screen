// New JavaScript file with basic content
function greetUser(name) {
  console.log(`Hello, ${name}! Welcome to the application.`);
}

function calculateSum(a, b) {
  return a + b;
}

function calculateAndDisplay() {
  const result = calculateSum(5, 3);
  const resultDiv = document.getElementById('result');
  if (resultDiv) {
    resultDiv.innerHTML = `The sum of 5 and 3 is: ${result}`;
  }
}

// Timer functionality
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString();
}

function updateTimerDisplay() {
  const timerDiv = document.getElementById('timer');
  if (timerDiv) {
    timerDiv.innerHTML = `Current time: ${getCurrentTime()}`;
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('New application loaded successfully!');
  greetUser('User');
  console.log('Sum of 5 and 3:', calculateSum(5, 3));

  // Set up timer to update every second
  setInterval(updateTimerDisplay, 1000);
});
