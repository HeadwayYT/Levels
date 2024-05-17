document.addEventListener('DOMContentLoaded', function() {
    // Load progress when the document is loaded
    loadProgressFromLocalStorage();

    // Event listener for add and remove buttons
    let addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            let skill = this.parentElement.parentElement.querySelector('input[type="text"]').id;
            addXP(skill);
        });
    });

    let removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            let skill = this.parentElement.parentElement.querySelector('input[type="text"]').id;
            remXP(skill);
        });
    });

    // Event listener to add new skill
    document.getElementById('addSkillButton').addEventListener('click', addNewSkill);
});

function addNewSkill() {
    const skillContainer = document.createElement('div');
    skillContainer.classList.add('skill-container');
    skillContainer.innerHTML = `
        <div class="skill">
            <input type="text" placeholder="New Skill...">
            <div class="level-counter">&nbsp&nbspLevel&nbsp;&nbsp;<span>1</span></div>
            <button class="remove-skill-button">Remove Skill</button>
        </div>
        <div class="elements">
            <button class="add-button">Add <br>XP</br></button>
            <button class="remove-button">Undo</button>
            <div class="bar">
                <div class="xp-progress"></div>
            </div>
        </div>
    `;

    // Append new skill container to the DOM under the existing skills
    const skillContainers = document.querySelectorAll('.skill-container');
    const lastSkillContainer = skillContainers[skillContainers.length - 1];
    lastSkillContainer.parentNode.insertBefore(skillContainer, lastSkillContainer.nextSibling);

    // Add event listeners to new buttons
    skillContainer.querySelector('.add-button').addEventListener('click', function() {
        let skill = this.parentElement.parentElement.querySelector('input[type="text"]').id;
        addXP(skill);
    });

    skillContainer.querySelector('.remove-button').addEventListener('click', function() {
        let skill = this.parentElement.parentElement.querySelector('input[type="text"]').id;
        remXP(skill);
    });

    skillContainer.querySelector('.remove-skill-button').addEventListener('click', function() {
        let skillContainer = this.parentElement.parentElement;
        removeSkill(skillContainer);
    });

    // Add unique ID to new skill input
    const newSkillInput = skillContainer.querySelector('input[type="text"]');
    newSkillInput.id = `skill-${Date.now()}`;
    newSkillInput.addEventListener('input', saveProgressToLocalStorage);

    // Save progress after adding a new skill
    saveProgressToLocalStorage();
}

function saveProgressToLocalStorage() {
    let skills = document.querySelectorAll('.skill-container');
    let progressData = {};

    skills.forEach(function(skill) {
        let skillInput = skill.querySelector('input[type="text"]');
        let skillName = skillInput.value;
        let level = skill.querySelector('.level-counter span').textContent;
        let xpWidth = skill.querySelector('.xp-progress').style.width;

        progressData[skillInput.id] = { skillName, level, xpWidth };
    });

    // Save progress data to local storage
    localStorage.setItem('skillData', JSON.stringify(progressData));
}

function loadProgressFromLocalStorage() {
    let skillDataString = localStorage.getItem('skillData');

    if (skillDataString) {
        let progressData = JSON.parse(skillDataString);
        for (let skillId in progressData) {
            if (progressData.hasOwnProperty(skillId)) {
                addSkillToDOM(skillId, progressData[skillId].skillName, progressData[skillId].level, progressData[skillId].xpWidth);
            }
        }
    }
}

function addSkillToDOM(skillId, skillName, level, xpWidth) {
    const skillContainer = document.createElement('div');
    skillContainer.classList.add('skill-container');
    skillContainer.innerHTML = `
        <div class="skill">
            <input type="text" id="${skillId}" value="${skillName}" placeholder="New Skill...">
            <div class="level-counter">&nbsp&nbspLevel&nbsp;&nbsp;<span>${level}</span></div>
            <button class="remove-skill-button">Remove Skill</button>
        </div>
        <div class="elements">
            <button class="add-button">Add <br>XP</br></button>
            <button class="remove-button">Undo</button>
            <div class="bar">
                <div class="xp-progress" style="width: ${xpWidth};"></div>
            </div>
        </div>
    `;

    // Append new skill container to the DOM under the existing skills
    const skillContainers = document.querySelectorAll('.skill-container');
    const lastSkillContainer = skillContainers[skillContainers.length - 1];
    lastSkillContainer.parentNode.insertBefore(skillContainer, lastSkillContainer.nextSibling);

    // Add event listeners to new buttons
    skillContainer.querySelector('.add-button').addEventListener('click', function() {
        let skill = this.parentElement.parentElement.querySelector('input[type="text"]').id;
        addXP(skill);
    });

    skillContainer.querySelector('.remove-button').addEventListener('click', function() {
        let skill = this.parentElement.parentElement.querySelector('input[type="text"]').id;
        remXP(skill);
    });

    skillContainer.querySelector('.remove-skill-button').addEventListener('click', function() {
        let skillContainer = this.parentElement.parentElement;
        removeSkill(skillContainer);
    });

    // Add event listener to new skill input
    skillContainer.querySelector('input[type="text"]').addEventListener('input', saveProgressToLocalStorage);
}

function addXP(skill) {
    let levelSpan = document.getElementById(skill + '-level');
    let progressDiv = document.getElementById(skill + '-progress').firstElementChild;
    let currentLevel = parseInt(levelSpan.textContent);
    let xpToAdd = 20; // Each tap adds 20% to the XP bar
    let maxXP = 100; // XP required to level up

    // Check if the progress bar is currently animating
    if (progressDiv.classList.contains('progress-bar')) {
        return; // Exit the function if the progress bar is still animating
    }

    // Calculate the new width of the XP progress bar
    let currentWidth = parseInt(progressDiv.style.width.slice(0, -1)) || 0;
    let newWidth = currentWidth + xpToAdd;

    // Check if the bar is full
    if (newWidth >= maxXP) {
        // Play sound effect when adding XP only if level up animation is not playing
        if (!progressDiv.parentNode.classList.contains('neon-effect')) {
            playAddXPSound();
        }

        // Update the progress bar width with animation
        progressDiv.classList.add('progress-bar');
        progressDiv.style.width = '100%';
        setTimeout(function() {
            // Remove the transition class after the animation is completed
            progressDiv.classList.remove('progress-bar');
            // Reset the width
            progressDiv.style.width = '0%';
            // Increase the level
            currentLevel++;
            levelSpan.textContent = currentLevel.toString();
            // Play level up sound
            playLevelUpSound();
            // Add neon effect
            progressDiv.parentNode.classList.add('neon-effect');
            // Remove neon effect after some time
            setTimeout(function() {
                progressDiv.parentNode.classList.remove('neon-effect');
            }, 300); // Neon effect lasts for 0.3 seconds
            saveProgressToLocalStorage(); // Save progress after level up animation completes
        }, 500); // Duration of the animation (same as CSS transition duration)
    } else {
        // Play sound effect when adding XP only if level up animation is not playing
        if (!progressDiv.parentNode.classList.contains('neon-effect')) {
            playAddXPSound();
        }

        // Update the progress bar width with animation
        progressDiv.classList.add('progress-bar');
        progressDiv.style.width = newWidth + '%';
        setTimeout(function() {
            progressDiv.classList.remove('progress-bar');
        }, 500); // Duration of the animation (same as CSS transition duration)
    }
}

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
        // Set the width to 0% (empty bar)
        progressDiv.style.width = '0%';
        // Decrease the level
        currentLevel--;
        levelSpan.textContent = currentLevel.toString();
        // Set the progress bar to 80% (since we are removing 20%)
        progressDiv.style.width = '80%';
    } else if (newWidth >= 0) {
        // Update the progress bar width
        progressDiv.style.width = newWidth + '%';
    }

    saveProgressToLocalStorage();
}

// Function to play level up sound
function playLevelUpSound() {
    let sound = new Audio('sounds/level-up-sound.mp3');
    sound.play();
}

// Function to play add XP sound
function playAddXPSound() {
    let sound = new Audio('sounds/add-xp-sound.mp3');
    sound.play();
}

// Function to remove a skill container
function removeSkill(skillContainer) {
    skillContainer.remove();
    saveProgressToLocalStorage();
}
