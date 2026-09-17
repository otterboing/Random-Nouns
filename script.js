const runtime = {'words_amount':2,'word_spacer':' ', 'auto-copy':false, 'current_words':[],'uppercase':false};

const templates = {
    'wordElement':`%WORD%%SPACER%`,
    'output_template':''
};

var words;

let wordsList = document.querySelector('#words-list');

const wordsloaded = new Event('wordsloaded');

function shuffle(arrayIn) {
    let array = arrayIn
    let currentIndex = array.length;

  // While there remain elements to shuffle...
    while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array
}

capitalize = function (string) {
    return string.slice(0,1).toUpperCase() + string.slice(1);
}

function clamp(value,min,max) {
    return value < min ? min : value > max ? max : value;
}

function randInt(min,max) {
    return clamp(Math.round(Math.random() * max),min,max);
}

function update_words() {
    wordsList.remove();
    wordsList = document.querySelector('#app #center').insertAdjacentElement('afterbegin',document.createElement('div'));
    wordsList.id = 'words-list';
    wordsTEMP = [];
    runtime.current_words.forEach(word => {
        wordsTEMP.push(runtime.uppercase ? capitalize(word) : word);
    });
    wordsList.insertAdjacentHTML('beforeend',wordsTEMP.join(runtime.word_spacer));
    if (runtime.auto_copy) {
        copyWords();
    }
}

async function loadWords() {
    wordsTemp = await fetch('assets/words.json');
    words = shuffle(JSON.parse(await wordsTemp.text()));
    dispatchEvent(wordsloaded);
}

function shuffleWords() {
    words = shuffle(words);
    return words;
}

loadWords();

function populateWords() {
    wordsList.remove();
    wordsList = document.querySelector('#app #center').insertAdjacentElement('afterbegin',document.createElement('div'));
    wordsList.id = 'words-list';
    runtime.current_words = [];
    for (let w = 0; w < runtime.words_amount; w++) {
    shuffleWords();
    let word = words[Math.round(Math.random() * words.length)];
    if (runtime.uppercase) {
        word = capitalize(word);
    }
    wordsList.insertAdjacentHTML('beforeend',templates.wordElement.replaceAll('%WORD%',word).replaceAll('%SPACER%',runtime.word_spacer));
    runtime.current_words.push(word);
    }
    wordsList.innerHTML = wordsList.innerHTML.slice(0,-1);
}

addEventListener('wordsloaded', function() {
    populateWords();
});

document.querySelector('#options #wordsAmount').addEventListener('change', function() {

});

function copyWords() {
    const words_output_array = [];
    runtime.current_words.forEach(word => {
        words_output_array.push(runtime.uppercase ? capitalize(word) : word);
    });
    window.navigator.clipboard.writeText(words_output_array.join(runtime.word_spacer));
}