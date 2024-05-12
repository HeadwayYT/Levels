// script.js
document.addEventListener('DOMContentLoaded', (event) => {
  // Function to add experience points
  function addXP(skill) {
      let levelSpan = document.getElementById(skill + '-level');
      let progressDiv = document.getElementById(skill + '-progress').firstElementChild;
      let currentLevel = parseInt(levelSpan.textContent);
      let xpToAdd = 20; // Each tap adds 20% to the XP bar
      let maxXP = 100; // XP required to level up

      // Calculate the new width of the XP progress bar
      let currentWidth = parseInt(progressDiv.style.width.slice(0, -1)) || 0;
      let newWidth = currentWidth + xpToAdd;

      // Check if the bar is full
      if (newWidth >= maxXP) {
          // Increase the level
          currentLevel++;
          levelSpan.textContent = currentLevel.toString();
          // Reset the progress bar
          newWidth = 0;
          // Add neon effect
          progressDiv.parentNode.classList.add('neon-effect');
          // Remove neon effect after some time
          setTimeout(() => {
              progressDiv.parentNode.classList.remove('neon-effect');
          }, 2000); // Neon effect lasts for 2 seconds
      }

      // Update the progress bar width
      progressDiv.style.width = newWidth + '%';
  }

  // Function to remove experience points
  function remXP(skill) {
      let levelSpan = document.getElementById(skill + '-level');
      let progressDiv = document.getElementById(skill + '-progress').firstElementChild;
      let currentLevel = parseInt(levelSpan.textContent);
      let xpToRemove = 20; // Each undo removes 20% from the XP bar

      // Calculate the new width of the XP progress bar
      let currentWidth = parseInt(progressDiv.style.width.slice(0, -1)) || 0;
      let newWidth = currentWidth - xpToRemove;

      // Check if the bar is empty and level is greater than 1
      if (newWidth < 0 && currentLevel > 1) {
          // Decrease the level
          currentLevel--;
          levelSpan.textContent = currentLevel.toString();
          // Set the progress bar to full (just below level up)
          newWidth = 80;
      } else if (newWidth < 0) {
          // Prevent the bar from going negative
          newWidth = 0;
      }

      // Update the progress bar width
      progressDiv.style.width = newWidth + '%';
  }

  // Attach the addXP and remXP functions to buttons
  let addButtons = document.querySelectorAll('.add-button');
  addButtons.forEach(button => {
      button.addEventListener('click', function() {
          let skill = this.getAttribute('onclick').match(/\('(.+)'\)/)[1];
          addXP(skill);
      });
  });

  let removeButtons = document.querySelectorAll('.Remove');
  removeButtons.forEach(button => {
      button.addEventListener('click', function() {
          let skill = this.getAttribute('onclick').match(/\('(.+)'\)/)[1];
          remXP(skill);
      });
  });
});

// Save data to local storage
function saveProgress() {
  let skills = document.querySelectorAll('.skill-container');
  let progressData = {};

  skills.forEach(skill => {
      let skillName = skill.querySelector('h2').textContent;
      let level = skill.querySelector('.level-counter span').textContent;
      let xpWidth = skill.querySelector('.xp-progress').style.width;

      progressData[skillName] = { level, xpWidth };
  });

  localStorage.setItem('skillProgress', JSON.stringify(progressData));
}

// Load data from local storage
function loadProgress() {
  let progressData = JSON.parse(localStorage.getItem('skillProgress'));

  if (progressData) {
      for (let skillName in progressData) {
          let skill = document.querySelector(`h2:contains('${skillName}')`).closest('.skill-container');
          let levelSpan = skill.querySelector('.level-counter span');
          let progressDiv = skill.querySelector('.xp-progress');

          levelSpan.textContent = progressData[skillName].level;
          progressDiv.style.width = progressData[skillName].xpWidth;
      }
  }
}

// Call loadProgress when the document is loaded
document.addEventListener('DOMContentLoaded', loadProgress);

