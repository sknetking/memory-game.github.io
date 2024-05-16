<html>
<head>
<meta property="og:url"content="https://codepen.io/sknetking/pen/xxNGavw" />
<meta property="og:type"content="article" /> 
 <meta property="og:title" content="Memory booster game by-sknetking" /> 
 <meta property="og:description" content="Memory booster game for kids and adults also it's boost your memory ." /> 
 <meta property="og:image" content="https://i.ibb.co/zr2sYjW/image.png" /><meta charset="UTF-8">
 <meta name="description" content="Memory booster game for kids and adults also it's boost your memory ."> 
 <meta name="keywords" content="Puzzle game, game, memory boost game, new game, new concept of game"> 
 <meta name="author" content="Shyam(sknetking)">
 <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
 <meta name="language" content="English">
  <style>
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0px;
}

.game-container {
    text-align: center;
}

.game-info {
    margin-bottom: 20px;
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-start;
}

.game-board {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    grid-gap: 10px;
    justify-content: center;
    max-width:500px;
    margin: 0 auto;
}

.card {
    width: 80px;
    height: 80px;
    background-color: #007BFF;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: white;
    cursor: pointer;
    position: relative;
}

.card span {
    display: none;
}

.card.flipped span,
.card.matched span {
    display: block;
}

.card.matched,
.card.flipped {
    background-color: #fff;
    color: #000;
    cursor: default;
}

#restart-btn {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}
p#moves {
    margin: 16px;
    background: yellow;
    padding: 11px;
}

p#matched {
    margin: 16px;
    background: #0bcf00;
    padding: 11px;
}

p#timer {
    margin: 16px;
    background: #d30707;
    padding: 11px;
    color: #fff;
}
div#winner {
    width: 200px;
    height: 70px;
    padding: 21px;
    position: absolute;
    top: 50%;
    left: 40%;
    background: green;
    color: #fff;
 display:none; 
}

@media only screen and (max-width: 600px) {
.game-board {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    grid-gap: 5px;
    justify-content: center;
    max-width:100vw;
    margin: 10 auto;
}
}
  </style>
</head>
<body>
<div class="game-container">
        <div class="game-info">
           <p id="moves">Moves: 0</p>
          <p id="matched">Matched: 0</p>
          <p id="timer">Time: 0s</p>
        </div>
        <div class="game-board" id="game-board"></div>
  <div class='winner' id='winner'> </div>
        <button id="restart-btn" onclick="init_game()">Restart Game</button>
    </div>
    <audio id="flip-sound" src="flip.wav"></audio>
    <audio id="match-sound" src="match.wav"></audio>
    <audio id="win-sound" src="win.wav"></audio>
<script>
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
  

</script>
</body>
</html>
