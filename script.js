// JavaScript for toggling explanation paragraph
const explanation = document.getElementById('explanation');
const toggleButton = document.getElementById('toggleExplanation');

toggleButton.addEventListener('click', () => {
    explanation.classList.toggle('hidden');
    toggleButton.textContent = explanation.classList.contains('hidden') ? 'Show Explanation' : 'Hide Explanation';
    // Save explanation visibility state to local storage
    localStorage.setItem('explanationHidden', explanation.classList.contains('hidden'));
});

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
        let skillInput = skill.querySelector('input[type="text"]');
        let skillName = skillInput.value;
        let level = skill.querySelector('.level-counter span').textContent;
        let xpWidth = skill.querySelector('.xp-progress').style.width;

        progressData[skillInput.id] = { skillName, level, xpWidth };
    });

    // Save progress data to local storage
    localStorage.setItem('skillData', JSON.stringify(progressData));
}

// Load data from local storage
function loadProgressFromLocalStorage() {
    let skillDataString = localStorage.getItem('skillData');

    if (skillDataString) {
        let progressData = JSON.parse(skillDataString);
        let skills = document.querySelectorAll('.skill-container');

        skills.forEach(skill => {
            let skillInput = skill.querySelector('input[type="text"]');
            let skillId = skillInput.id;
            if (progressData.hasOwnProperty(skillId)) {
                let levelSpan = skill.querySelector('.level-counter span');
                let progressDiv = skill.querySelector('.xp-progress');
                skillInput.value = progressData[skillId].skillName;
                levelSpan.textContent = progressData[skillId].level;
                progressDiv.style.width = progressData[skillId].xpWidth;
            }
        });
    }
}

// Function to play level up sound
function playLevelUpSound() {
    let sound = new Audio('win.mp3');
    sound.play();
}

// Function to play sound effect when adding XP
function playAddXPSound() {
    let sound = new Audio('win2.mp3');
    sound.play();
}

// Event listeners for add and remove buttons
document.addEventListener('DOMContentLoaded', () => {
    let addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            let skill = this.parentElement.parentElement.querySelector('input[type="text"]').id;
            addXP(skill);
        });
    });

    let removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            let skill = this.parentElement.parentElement.querySelector('input[type="text"]').id;
            remXP(skill);
        });
    });

    // Load progress when the document is loaded
    loadProgressFromLocalStorage();
});

// Save progress before the page unloads
window.addEventListener('beforeunload', saveProgressToLocalStorage);

// Event listener to detect changes in skill names
document.querySelectorAll('.skill-container input[type="text"]').forEach(skillInput => {
    skillInput.addEventListener('input', function() {
        saveProgressToLocalStorage(); // Save progress when a skill name is changed
    });
});