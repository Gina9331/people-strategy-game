// Strategy data with separate content for front and back
const strategies = [
    { id: 'A', front: 'Equality, Diversity & Inclusion Strategy', isCorrect: true, back: 'It\'s correct!<br><br> To find out more, contact Punam Khaira.' },
    { id: 'C', front: 'Talent Strategy', isCorrect: true, back: 'It\'s correct! <br><br> To find out more, contact Zoe Farrell.' },
    { id: 'E', front: 'Health, Safety & Wellbeing Strategy', isCorrect: true, back: 'It\'s correct! <br><br> To find out more, contact Dan Hutley.' },
    { id: 'G', front: 'Reward Strategy', isCorrect: true, back: 'It\'s correct! <br><br> To find out more, contact Jo Disney.' },
    { id: 'I', front: 'Workforce Planning Strategy', isCorrect: true, back: 'It\'s correct! <br><br> To find out more, contact Sara Mansell.' },
    { id: 'K', front: 'Career Entry Strategy', isCorrect: true, back: 'It\'s correct! <br><br> To find out more, contact Rosie McTigue.' },
    { id: 'M', front: 'Apprenticeship Strategy', isCorrect: true, back: 'It\'s correct! <br><br> To find out more, contact Sara Mansell.' },
    { id: 'O', front: 'Resourcing Strategy', isCorrect: true, back: 'It\'s correct! <br><br> To find out more, contact Katie Gibson.' },
    { id: 'H', front: 'Digital Enabling Strategy', isCorrect: true, back: 'It\'s correct! <br><br> To find out more, contact Graham Dickinson.' },
    { id: 'P', front: 'Attraction & Outreach Strategy', isCorrect: true, back: 'It\'s correct! <br><br> To find out more, contact Jen Delderfield.' },

    // Incorrect Strategies (6 total)
    { id: 'B', front: 'Professional Standards Strategy', isCorrect: false, back: 'Not quite! <br><br>But do tell us why you chose this one.' },
    { id: 'D', front: 'Change Management Strategy', isCorrect: false, back: 'Not quite! <br><br>But do tell us why you chose this one.' },
    { id: 'F', front: 'Education Strategy', isCorrect: false, back: 'Not quite! <br><br>But do tell us why you chose this one.' },
    { id: 'J', front: 'Project Delivery Strategy', isCorrect: false, back: 'Not quite! <br><br>But do tell us why you chose this one.' },
    { id: 'L', front: 'Environmental Impact Strategy', isCorrect: false, back: 'Not quite! <br><br>But do tell us why you chose this one.' },
    { id: 'N', front: 'Business Delivery Strategy', isCorrect: false, back: 'Not quite! <br><br>But do tell us why you chose this one.' }
];

let correctGuesses = 0;
const totalCorrectCards = 10;
let hasSelectedIncorrect = false;

// Create and append the progress message element
const progressMessage = document.createElement('div');
progressMessage.id = 'progress-message';
progressMessage.textContent = `You're doing great, only ${totalCorrectCards - correctGuesses} more Strategies left to pick!`;
document.body.appendChild(progressMessage);

// Update the progress message
function updateProgressMessage() {
    if (hasSelectedIncorrect) {
        progressMessage.textContent = "Aww, too bad. Thanks for playing! Press 'Reset Game' to try again.";
        progressMessage.style.display = 'block'; // Ensure the message is shown
        return;
    }

    const remaining = totalCorrectCards - correctGuesses;
    if (remaining === 0) {
        progressMessage.textContent = "Congratulations, you picked all 10 correct Strategies, you really know your stuff!";
        progressMessage.style.display = 'block';
    } else {
        progressMessage.innerHTML = `You're doing great, only <span style="text-decoration: underline;">${remaining}</span> more Strategies left to pick!`;
        progressMessage.style.display = 'block'; // Ensure the message is shown
    }
}




// Function to shuffle strategies
function shuffleStrategies(strategies) {
    for (let i = strategies.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [strategies[i], strategies[j]] = [strategies[j], strategies[i]];
    }
    return strategies;
}

// Function to create cards dynamically
function createCards() {
    const cardGrid = document.querySelector('.card-grid');
    const shuffledStrategies = shuffleStrategies([...strategies]);

    shuffledStrategies.forEach(strategy => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-id', strategy.id);
        card.setAttribute('data-correct', strategy.isCorrect);

        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.textContent = strategy.front;

        const cardBack = document.createElement('div');
        cardBack.className = `card-back ${strategy.isCorrect ? 'correct' : 'incorrect'}`;
        cardBack.innerHTML = `
        <span class="icon" style="color: ${strategy.isCorrect ? 'green' : 'red'}">${strategy.isCorrect ? '✔' : '✖'}</span>
        <p>${strategy.back}</p>
    `;
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        card.addEventListener('click', () => flipCard(strategy.id, strategy.isCorrect));

        cardGrid.appendChild(card);
    });
}

// Function to flip a card
function flipCard(cardId, isCorrect) {
    const card = document.querySelector(`.card[data-id="${cardId}"]`);
    const drumroll = document.getElementById("drumroll");
    const correctSound = document.getElementById("yay");
    const incorrectSound = document.getElementById("aww");

    // Prevent flipping if the game is over (an incorrect card was selected)
    if (hasSelectedIncorrect || card.classList.contains('flipped')) return;

    // Play drumroll and add flipping animation
    drumroll.currentTime = 0;
    drumroll.play();

    let flipCount = 0;
    const flipInterval = setInterval(() => {
        card.classList.toggle("flipped");
        flipCount++;
        if (flipCount >= 6) {
            clearInterval(flipInterval);

            // Stop drumroll and reveal back
            drumroll.pause();
            drumroll.currentTime = 0;
            card.classList.add("flipped");

            if (isCorrect) {
                correctSound.pause();
                correctSound.currentTime = 0;
                correctSound.play();
                correctGuesses++;
                updateProgressMessage();

                // Only show winner popup if all correct strategies are picked
                if (correctGuesses === totalCorrectCards) {
                    showWinnerPopup();
                }
            } else {
                incorrectSound.pause();
                incorrectSound.currentTime = 0;
                incorrectSound.play();
                hasSelectedIncorrect = true; // Set the flag to stop further flips
                updateProgressMessage(); // Update the message for incorrect selection
            }
        }
    }, 200);
}

// Function to reset a single card
function resetCard(cardId) {
    const card = document.querySelector(`.card[data-id="${cardId}"]`);
    if (card.classList.contains('flipped')) {
        card.classList.remove('flipped');
        if (card.getAttribute('data-correct') === 'true') {
            correctGuesses--; // Decrease correct guesses when resetting a correct card
        }
    }
}

// Function to show the winning popup
function showWinnerPopup() {
    const winnerPopup = document.getElementById('winner-popup');
    const winningSound = document.getElementById("winning");
    winnerPopup.classList.remove('hidden');
    winningSound.pause();
    winningSound.currentTime = 0;
    winningSound.play()
}

// Function to reset the game
function resetGame() {
    // Reset variables
    correctGuesses = 0;
    hasSelectedIncorrect = false;

    // Hide the winner popup
    const winnerPopup = document.getElementById('winner-popup');
    winnerPopup.classList.add('hidden');

    // Reset the progress message
    progressMessage.style.display = 'none';
    progressMessage.textContent = `You're doing great, only ${totalCorrectCards} more Strategies left to pick!`;

    // Clear the card grid
    const cardGrid = document.querySelector('.card-grid');
    cardGrid.innerHTML = '';

    // Recreate the cards with shuffled strategies
    createCards();
}
// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Ensure popup is hidden initially
    const winnerPopup = document.getElementById('winner-popup');
    winnerPopup.classList.add('hidden');
   
    // Create cards
    createCards();
   
    // Add reset button
    const resetButton = document.createElement('button');
    resetButton.id = 'reset-button';
    resetButton.textContent = 'Reset Game';
    resetButton.onclick = resetGame;
    document.body.appendChild(resetButton);
});
