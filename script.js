const runtime = {'words_amount':2,'word_spacer':' ', 'auto-copy':false, 'current_words':[],'uppercase':false,'saved_words':[]};

const keys = {"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"backspace":8,"tab":9,"enter":13,"shift":16,"ctrl":17,"alt":18,"pausebreak":19,"capslock":20,"esc":27,"space":32,"pageup":33,"pagedown":34,"end":35,"home":36,"leftarrow":37,"uparrow":38,"rightarrow":39,"downarrow":40,"print_screen":44,"insert":45,"delete":46,"a":65,"b":66,"c":67,"d":68,"e":69,"f":70,"g":71,"h":72,"i":73,"j":74,"k":75,"l":76,"m":77,"n":78,"o":79,"p":80,"q":81,"r":82,"s":83,"t":84,"u":85,"v":86,"w":87,"x":88,"y":89,"z":90,"leftwindowkey":91,"rightwindowkey":92,"selectkey":93,"numpad0":96,"numpad1":97,"numpad2":98,"numpad3":99,"numpad4":100,"numpad5":101,"numpad6":102,"numpad7":103,"numpad8":104,"numpad9":105,"multiply":106,"add":107,"subtract":109,"decimalpoint":110,"divide":111,"f1":112,"f2":113,"f3":114,"f4":115,"f5":116,"f6":117,"f7":118,"f8":119,"f9":120,"f10":121,"f11":122,"f12":123,"numlock":144,"scrolllock":145,"semicolon":186,"equalsign":187,"comma":188,"dash":189,"period":190,"forwardslash":191,"graveaccent":192,"openbracket":219,"backslash":220,"closebracket":221,"singlequote":222};

const templates = {
    'wordElement':`%WORD%%SPACER%`,
    'output_template':'',
    'wordsaveTemplate': `<div class="wordsave" title="copy" onclick="copyText(`+'`%WORD%`'+`);"><span>%WORD%</span><button class="del-wordsave">X</button></div>`
};

var words;

let wordsList = document.querySelector('#words-list');

const savedWords = document.querySelector('#saved-words');

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
    if (runtime.auto_copy) {copyWords();}
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

function copyText(string) {
    if (typeof string == 'string') {
    window.navigator.clipboard.writeText(string);
    } else {
        console.warn('Input must be a string!');
    }
}

addEventListener('click', function() {
    if (event.target.matches('#saved-words .wordsave .del-wordsave')) {
        event.target.parentNode.remove();
    }
});

addEventListener('keydown', function() {
const key = event.keyCode;
if (!document.activeElement.matches('input[type="text"]')) {
    if (key == keys.e) {
        populateWords();
    }
    if (key == keys.s) {
        addWordsave(wordsList.innerText);
    }
}
})

function addWordsave(word) {
    if (typeof word == 'string') {
    runtime.saved_words.push(word);
    savedWords.insertAdjacentHTML('beforeend',templates.wordsaveTemplate.replaceAll('%WORD%',word));
    }
}