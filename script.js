let timer;
let isPaused = false;
let moodRatings = [];
const entriesList = [];
let isBreakTime = false; // Pour gérer la transition entre travail et pause
let timeRemaining = 2; // Durée initiale pour les tests (25 minutes pour production)

// Éléments DOM
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
const moodInputs = document.querySelectorAll('[name="mood"]');
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
                if (!isBreakTime) {
                    showPopup();
                } else {
                    resetWorkTimer(); // Retour au travail après la pause
                }
            }
        }
    }, 1000);
    startButton.disabled = true;
    pauseButton.disabled = false;
    cancelButton.disabled = false;
}

function startBreakTimer() {
    isBreakTime = true;
    timeRemaining = 5 * 60; // 5 minutes
    updateTimerDisplay();
    startTimer();
}

function resetWorkTimer() {
    isBreakTime = false;
    timeRemaining = 25 * 60; // 25 minutes
    updateTimerDisplay();
    resetButtons();
}

function pauseTimer() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Reprendre' : 'Pause';
}

function cancelTimer() {
    clearInterval(timer);
    resetWorkTimer();
}

function resetButtons() {
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
    startBreakTimer(); // Démarrer le timer de pause après avoir fermé la popup
}

function calculateMoodAverage() {
    if (moodRatings.length === 0) {
        moodAverageSpan.textContent = "0";
        return;
    }
    const moodAverage = (moodRatings.reduce((sum, rating) => sum + rating, 0) / moodRatings.length).toFixed(1);
    moodAverageSpan.textContent = moodAverage;
}

function updateFilterOptions() {
    const uniqueTags = [...new Set(entriesList.map(entry => entry.tag))];
    filterSelect.innerHTML = '<option value="all">Tous</option>';
    uniqueTags.forEach(tag => {
        const option = document.createElement("option");
        option.value = tag;
        option.textContent = tag;
        filterSelect.appendChild(option);
    });
}

function renderFilteredEntries() {
    const selectedTag = filterSelect.value;
    journalEntries.innerHTML = "";

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

    calculateMoodAverage();
    updateFilterOptions();
    renderFilteredEntries();

    descriptionInput.value = '';
    tagInput.value = '';
    moodInputs.forEach(input => (input.checked = false));
    hidePopup();
}

filterSelect.addEventListener("change", renderFilteredEntries);
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
cancelButton.addEventListener('click', cancelTimer);
saveButton.addEventListener('click', saveEntry);
cancelPopupButton.addEventListener('click', hidePopup);

updateTimerDisplay();
