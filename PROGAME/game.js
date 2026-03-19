let currentWord="", currentHint="";
let guessedLetters=[], score=0, level=1, attempts=5;
let selectedCategory="";

const wordDisplay=document.getElementById('word-display');
const scoreElement=document.getElementById('score');
const levelElement=document.getElementById('level');
const attemptsElement=document.getElementById('attempts');
const keyboard=document.getElementById('keyboard');
const hintText=document.getElementById('hint-text');
const modal=document.getElementById('game-over-modal');

async function fetchWord(){
    try{
        let res=await fetch("https://random-word-api.herokuapp.com/word");
        let data=await res.json();
        return {word:data[0].toUpperCase(),hint:"Guess the word"};
    }catch{return null;}
}

function selectCategory(cat){
    selectedCategory=cat;
    document.getElementById('category-section').style.display='none';
    document.getElementById('game-area').style.display='block';
    startNewGame();
}

async function startNewGame(){
    guessedLetters=[];
    attempts=Math.max(3,6-Math.floor(level/2));

    let data=await fetchWord();
    if(!data){
        let arr=wordDatabase[selectedCategory];
        data=arr[Math.floor(Math.random()*arr.length)];
    }

    currentWord=data.word;
    currentHint=data.hint;

    updateDisplay();
    createKeyboard();
}

function updateDisplay(){
    scoreElement.textContent=score;
    levelElement.textContent=level;
    attemptsElement.textContent=attempts;

    wordDisplay.innerHTML="";
    for(let l of currentWord){
        let box=document.createElement('div');
        box.className='letter-box';

        if(l===" ") box.textContent=" ";
        else if(guessedLetters.includes(l)){
            box.textContent=l;
            box.classList.add('correct');
        } else box.textContent="_";

        wordDisplay.appendChild(box);
    }
}

function createKeyboard(){
    keyboard.innerHTML="";
    for(let i=65;i<=90;i++){
        let l=String.fromCharCode(i);
        let btn=document.createElement('button');
        btn.textContent=l;
        btn.className="key";
        btn.onclick=()=>handleGuess(l);
        keyboard.appendChild(btn);
    }
}

function handleGuess(l){
    if(guessedLetters.includes(l)) return;

    guessedLetters.push(l);

    if(currentWord.includes(l)){
        score+=10;
    } else {
        attempts--;
        if(attempts<=0) return gameOver(false);
    }

    updateDisplay();
    checkWin();
}

function checkWin(){
    let letters=currentWord.replace(/ /g,'').split('');
    if(letters.every(l=>guessedLetters.includes(l))){
        score+=attempts*5;
        level++;
        setTimeout(()=>gameOver(true),500);
    }
}

function gameOver(win){
    modal.classList.add('show');
    document.getElementById('modal-title').textContent=
        win?"You Won 🎉":"Game Over";

    document.getElementById('correct-word').textContent=
        win?"":"Word: "+currentWord;
}

function closeModal(){
    modal.classList.remove('show');
    startNewGame();
}

function showHint(){
    if(score<1) return;
    score--;
    hintText.textContent=currentHint;
}

function resetGame(){score=0;level=1;startNewGame();}
function backToCategories(){location.reload();}
