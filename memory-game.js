// document.addEventListener('DOMContentLoaded', () => {
function init_game(){
    let moves = 0;
    let matches = 0;
    let gameActive = true;
    let timer;
    let seconds = 0;
    let firstCard = null;
    let lockBoard = false;

    const cards = [
        'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D',
        'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'
    ];

    function startGame() {
        moves = 0;
        matches = 0;
        seconds = 0;
        gameActive = true;
        firstCard = null;
        lockBoard = false;
        document.getElementById('moves').innerText = 'Moves: 0';
        document.getElementById('matched').innerText = 'Matched: 0';
        document.getElementById('timer').innerText = 'Time: 0s';
        document.getElementById('winner').style.display = 'none';
        clearInterval(timer);

        shuffleCards();
        initializeBoard();

        timer = setInterval(() => {
            seconds++;
            document.getElementById('timer').innerText = `Time: ${seconds}s`;
            if (seconds === 60) {
                endGame(false); // Game over if 1 minute elapsed
            }
        }, 1000);
    }

    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    function initializeBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.value = card;
            cardElement.addEventListener('click', onCardClick);
            gameBoard.appendChild(cardElement);
        });
    }

    function onCardClick(event) {
        if (!gameActive || lockBoard) return;

        const clickedCard = event.target;
        if (clickedCard === firstCard) return; // Prevent clicking the same card twice

        clickedCard.classList.add('flipped');
        clickedCard.innerText = clickedCard.dataset.value;

        if (!firstCard) {
            firstCard = clickedCard;
            return;
        }

        lockBoard = true;
        moves++;
        document.getElementById('moves').innerText = `Moves: ${moves}`;

        if (firstCard.dataset.value === clickedCard.dataset.value) {
            matches++;
            document.getElementById('matched').innerText = `Matched: ${matches}`;
            firstCard.removeEventListener('click', onCardClick);
            clickedCard.removeEventListener('click', onCardClick);
            resetBoard();

            if (matches === cards.length / 2) {
                endGame(true); // All matches found
                           endGame(true); // All matches found
            }
        } else {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                clickedCard.classList.remove('flipped');
                firstCard.innerText = '';
                clickedCard.innerText = '';
                resetBoard();
            }, 1000);
        }
    }

    function resetBoard() {
        [firstCard, lockBoard] = [null, false];
    }

    function endGame(won) {
        gameActive = false;
        clearInterval(timer);
        if (won) {
            document.getElementById('winner').innerText = `Congratulations! You've completed the game in ${seconds}s with ${moves} moves.`;
            document.getElementById('winner').style.display = 'block';
        } else {
            alert(`Time's up! You've made ${moves} moves.`);
        }
    }

    // Start the game when the page loads
    startGame();
}
  init_game();
  
