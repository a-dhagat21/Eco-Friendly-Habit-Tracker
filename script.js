let dailyGoal = parseInt(localStorage.getItem('dailyGoal')) || null;
let dailyProgress = parseInt(localStorage.getItem('dailyProgress')) || 0;

function askForGoal() {
  const goal = prompt("Set your daily eco-goal in points (Each action = 10 points):", "50");
  if (goal && !isNaN(goal) && parseInt(goal) > 0) {
    dailyGoal = parseInt(goal);
    dailyProgress = 0;
    lastUpdated = new Date().toDateString();

    localStorage.setItem('dailyGoal', dailyGoal);
    localStorage.setItem('dailyProgress', dailyProgress);
    localStorage.setItem('lastUpdated', lastUpdated);

    updateProgressBar();
  } else {
    alert("Please enter a valid number!");
    askForGoal();
  }
}


// Select the form, input, list, and score elements
const sortBtn = document.getElementById('sort-habits');
let sortByName = true; 
const form = document.getElementById('habit-form');
const input = document.getElementById('habit-input');
const habitList = document.getElementById('habit-list');
const scoreDisplay = document.getElementById('score');
const clearAllBtn = document.getElementById('clear-all');

let habits = JSON.parse(localStorage.getItem('habits')) || [];
let score = parseInt(localStorage.getItem('score')) || 0;
let lastUpdated = localStorage.getItem('lastUpdated') || null;


// Update displayed list and score, also has a delete button for each task
function updateDisplay() {
  habitList.innerHTML = '';

  habits.forEach((habit, index) => {
    const li = document.createElement('li');

    // Display habit name and date
    li.textContent = `${habit.name} (added: ${new Date(habit.date).toLocaleDateString()})`;

    // EDIT BUTTON
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => {
      editHabit(index);
    });

    // DELETE BUTTON
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
      habits.splice(index, 1);
      score -= 10;
      localStorage.setItem('habits', JSON.stringify(habits));
      localStorage.setItem('score', score);
      updateDisplay();
    });

    // Add buttons to list item
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    habitList.appendChild(li);
  });

  scoreDisplay.textContent = score;
}

function editHabit(index) {
  const newName = prompt('Edit habit:', habits[index].name);
  if (newName && newName.trim() !== '') {
    habits[index].name = newName.trim();
    localStorage.setItem('habits', JSON.stringify(habits));
    updateDisplay();
  }
}

// Listening for when the user adds a new habit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const habit = input.value.trim();
  if (habit) {
    habits.push({
      name: habit,
      date: new Date().toISOString()
    });
    score += 10;
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('score', score);
    dailyProgress += 10; // each eco-action = 10 points
    localStorage.setItem('dailyProgress', dailyProgress);

    // update the date when progress was last modified
    lastUpdated = new Date().toDateString();
    localStorage.setItem('lastUpdated', lastUpdated);
    updateProgressBar();
    updateProgressBar();
    updateDisplay();
    input.value = '';
  }
});

clearAllBtn.addEventListener('click', () => {
  // Confirm before clearing everything
  if (confirm('Are you sure you want to clear all habits?')) {
    habits = [];      // Reset habits array
    score = 0;        // Reset score
    localStorage.removeItem('habits');
    localStorage.removeItem('score');
    updateDisplay();  // Refresh UI
  }
});

sortBtn.addEventListener('click', () => {
  if (sortByName) {
    // Sort alphabetically by name
    habits.sort((a, b) => a.name.localeCompare(b.name));
    sortBtn.textContent = 'Sort by Date';
  } else {
    // Sort by date (newest first)
    habits.sort((a, b) => new Date(b.date) - new Date(a.date));
    sortBtn.textContent = 'Sort A-Z';
  }
  sortByName = !sortByName;
  updateDisplay();
});

function updateProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  const goalText = document.getElementById('goal-text');

  if (dailyGoal && progressBar) {
    const percent = Math.min((dailyProgress / dailyGoal) * 100, 100);
    progressBar.style.width = `${percent}%`;

    goalText.textContent = `Daily Goal: ${dailyProgress}/${dailyGoal} points`;

    // Trigger confetti if the goal is reached
    if (dailyProgress >= dailyGoal) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      alert("🎉 Congrats! You've reached your daily eco-goal!");
      // Reset progress for the next day (optional)
      dailyProgress = 0;
      localStorage.setItem('dailyProgress', dailyProgress);
      updateProgressBar();
    }
  }
}

updateDisplay();
updateProgressBar();
if (!dailyGoal) {
  askForGoal();
}
if (lastUpdated && lastUpdated !== new Date().toDateString()) {
  dailyProgress = 0; // reset progress
  localStorage.setItem('dailyProgress', dailyProgress);

  // Update lastUpdated to today's date
  lastUpdated = new Date().toDateString();
  localStorage.setItem('lastUpdated', lastUpdated);

  updateProgressBar();
}