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
        // Play level up sound
        playLevelUpSound();
        // Add neon effect
        progressDiv.parentNode.classList.add('neon-effect');
        // Reset the progress bar with animation
        progressDiv.classList.add('progress-bar');
        progressDiv.style.width = '100%';
        setTimeout(() => {
            // Remove the transition class after the animation is completed
            progressDiv.classList.remove('progress-bar');
            // Reset the width
            progressDiv.style.width = '0%';
            // Remove neon effect after some time
            setTimeout(() => {
                progressDiv.parentNode.classList.remove('neon-effect');
            }, 300); // Neon effect lasts for 2 seconds
        }, 500); // Duration of the animation (same as CSS transition duration)
    } else {
        // Play sound effect when adding XP only if level up animation is not playing
        if (!progressDiv.parentNode.classList.contains('neon-effect')) {
            playAddXPSound();
        }
        
        // Update the progress bar width with animation
        progressDiv.classList.add('progress-bar');
        progressDiv.style.width = newWidth + '%';
        setTimeout(() => {
            progressDiv.classList.remove('progress-bar');
        }, 500); // Duration of the animation (same as CSS transition duration)
    }
    saveProgressToLocalStorage(); // Save progress after adding XP
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
    saveProgressToLocalStorage(); // Save progress after removing XP
}

// Save data to local storage
function saveProgressToLocalStorage() {
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
function loadProgressFromLocalStorage() {
    let progressDataString = localStorage.getItem('skillProgress');

    if (progressDataString) {
        let progressData = JSON.parse(progressDataString);

        for (let skillName in progressData) {
            let skills = document.querySelectorAll('.skill-container');
            skills.forEach(skill => {
                let h2 = skill.querySelector('h2');
                if (h2 && h2.textContent in progressData) { // Check if the saved skill name exists in the DOM
                    let levelSpan = skill.querySelector('.level-counter span');
                    let progressDiv = skill.querySelector('.xp-progress');

                    levelSpan.textContent = progressData[skillName].level;
                    progressDiv.style.width = progressData[skillName].xpWidth;
                }
            });
        }
    }
}

// Function to play level up sound
function playLevelUpSound() {
    let sound = new Audio('win.mp3');
    sound.play();
}

// Function to play sound effect when adding XP
function playAddXPSound() {
    let sound = new Audio('win2.mp3'); // Replace 'add_xp_sound.mp3' with the path to your sound effect
    sound.play();
}

// Event listeners for add and remove buttons
document.addEventListener('DOMContentLoaded', (event) => {
    let addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            let skill = this.getAttribute('data-skill');
            addXP(skill);
        });
    });

    let removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            let skill = this.getAttribute('data-skill');
            remXP(skill);
        });
    });

    // Load progress when the document is loaded
    loadProgressFromLocalStorage();
});

// Save progress before the page unloads
window.addEventListener('beforeunload', saveProgressToLocalStorage);