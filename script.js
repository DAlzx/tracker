let timer;
//let timeRemaining = 25 * 60; // 25 minutes
let timeRemaining = 2; // 25 minutes
let isPaused = false;
let moodRatings = [];
const entriesList = []; // Pour stocker les entrées avec tag, description et humeur

const timerDisplay = document.querySelector('#timer');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');
const cancelButton = document.querySelector('#cancel');
const popup = document.querySelector('#popup');
const saveButton = document.querySelector('#save');
const cancelPopupButton = document.querySelector('#cancel-popup');
const journalEntries = document.querySelector('#entries');
const descriptionInput = document.querySelector('#description');
const tagInput = document.querySelector('#tag');
const moodInputs = document.querySelector('.mood');
const moodAverageSpan = document.querySelector("#moodAverage");
const filterSelect = document.querySelector("#filter");

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const seconds = (timeRemaining % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
    timer = setInterval(() => {
        if (!isPaused) {
            timeRemaining--;
            updateTimerDisplay();
            if (timeRemaining === 0) {
                clearInterval(timer);
                showPopup();
            }
        }
    }, 1000);
    startButton.disabled = true;
    pauseButton.disabled = false;
    cancelButton.disabled = false;
}

function pauseTimer() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Reprendre' : 'Pause';
}

function cancelTimer() {
    clearInterval(timer);
    resetTimer();
}

function resetTimer() {
    //timeRemaining = 25 * 60; // Reset to 25 minutes
    timeRemaining = 2; // Reset to 25 minutes
    updateTimerDisplay();
    startButton.disabled = false;
    pauseButton.disabled = true;
    cancelButton.disabled = true;
    pauseButton.textContent = 'Pause';
    isPaused = false;
}

function showPopup() {
    popup.style.display = 'flex';
}

function hidePopup() {
    popup.style.display = 'none';
}

function calculateMoodAverage() {
    const moodAverage = (moodRatings.reduce((sum, rating) => sum + rating, 0) / moodRatings.length).toFixed(1);
    moodAverageSpan.textContent = moodAverage;
}

function updateFilterOptions() {
    // Supprime les doublons dans le filtre
    const uniqueTags = [...new Set(entriesList.map(entry => entry.tag))];
    filterSelect.innerHTML = '<option value="all">Tous</option>'; // Réinitialise
    uniqueTags.forEach(tag => {
        const option = document.createElement("option");
        option.value = tag;
        option.textContent = tag;
        filterSelect.appendChild(option);
    });
}

function renderFilteredEntries() {
    const selectedTag = filterSelect.value;
    journalEntries.innerHTML = ""; // Réinitialise les entrées visibles

    const filteredEntries = selectedTag === "all"
        ? entriesList
        : entriesList.filter(entry => entry.tag === selectedTag);

    filteredEntries.forEach(({ description, tag, mood }) => {
        const entry = document.createElement("div");
        entry.className = "entry";
        entry.innerHTML = `
            <p><strong>Description :</strong> ${description}</p>
            <p><strong>Humeur :</strong> ${mood} / 10</p>
            <p><strong>Tag :</strong> ${tag}</p>
        `;
        journalEntries.appendChild(entry);
    });
}

function saveEntry() {
    const description = descriptionInput.value.trim();
    const tag = tagInput.value.trim();
    const mood = Array.from(moodInputs).find(input => input.checked)?.value;

    if (!description || !mood || !tag) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    const newEntry = { description, tag, mood: Number(mood) };
    entriesList.push(newEntry);
    moodRatings.push(Number(mood));

    // Met à jour la moyenne et les options du filtre
    calculateMoodAverage();
    updateFilterOptions();
    renderFilteredEntries();

    // Réinitialise le formulaire
    descriptionInput.value = '';
    tagInput.value = '';
    moodInputs.forEach(input => (input.checked = false));
    hidePopup();
    resetTimer();
}

// Écouteur pour le filtre
filterSelect.addEventListener("change", renderFilteredEntries);

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
cancelButton.addEventListener('click', cancelTimer);
saveButton.addEventListener('click', saveEntry);
cancelPopupButton.addEventListener('click', hidePopup);

updateTimerDisplay();
