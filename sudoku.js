const items = document.querySelectorAll('.item');
const game = document.querySelector('.game');
const squares = document.querySelectorAll('.square');
const mistakes = document.querySelector('.mistakes');
const points = document.querySelector('.points p')
let record;
let rcont = 0;
let wcont = 0;
let block = false;
let notesOn = false;
let history = [];
let noModHistory = [];
let noteLoc = [[], [], [], [], [], [], [], [], []];

/*======= Reactive Board =======*/

items.forEach(item => {
    item.addEventListener('click', () => {
        removePrevious('on');
        removePrevious('rel');
        removePrevious('rec');
        removePrevious('noteRec')

        item.classList.add('on');

        for (let i = 0; i < 9; i++) {
            const current = item.parentNode.children[i];

            !current.classList.contains('on') && current.classList.add('rel');
        }

        const squareOn = parseInt(item.parentNode.dataset.square);
        const onIndex = parseInt(item.dataset.item);

        settingRels(getOtherRels(parseInt(onIndex) + 1), getOtherRels(parseInt(squareOn) + 1), (xquare, sqyare) => {
            xquare.classList.add('rel');
            sqyare.classList.add('rel');
        });

        if (item.children.length != 0) return;

        getOtherNums(item.textContent);
        getOtherNumsFromNotes(item.textContent);
    })
})


const removePrevious = (param) => {
    const prevs = document.querySelectorAll('.' + param);

    prevs.forEach(prev => {
        prev.classList.remove(param);
    });
}


const getOtherRels = (num) => {
    /* X axis */
    const colRaw = num % 3;
    let col = colRaw == 0 ? 3 : colRaw;

    /* Y axis */
    const rowRaw = num / 3;
    let row = rowRaw.toString().length == 1 ? rowRaw : parseInt(rowRaw.toString()[0]) + 1;

    return filler(col, row);
}

const filler = (col, row) => {
    let filled = [];
    let colOp = (col + (row - 1) * 3);

    col == 1 ? filled.push([colOp, colOp + 1, colOp + 2]) : (col == 2 ? filled.push([colOp - 1, colOp, colOp + 1]) : filled.push([colOp - 2, colOp - 1, colOp]));

    row == 1 ? filled.push([colOp, colOp + 3, colOp + 6]) : (row == 2 ? filled.push([colOp - 3, colOp, colOp + 3]) : filled.push([colOp - 6, colOp - 3, colOp]));

    return filled;
}

const settingRels = (posDir, posSq, cb) => {
    for (let i = 0; i < 3; i++) {
        let xquare = squares[posSq[0][i] - 1];
        let sqyare = squares[posSq[1][i] - 1];

        for (let j = 0; j < 3; j++) {
            cb(xquare.children[posDir[0][j] - 1], sqyare.children[posDir[1][j] - 1])
        }
    }
}

const getOtherNums = (param) => {
    if (param == '') return;

    let numRecord = record[param - 1];

    for (let i = 0; i < 9; i++) {
        const targetSquare = squares[numRecord[i][0]].children[numRecord[i][1]];
        if (targetSquare.textContent == param && targetSquare.children.length == 0) targetSquare.classList.add('rec');
    }
}

const getOtherNumsFromNotes = (param) => {
    let noteLocRecord = noteLoc[param - 1];
    
    if (!noteLocRecord) return;

    for (let i = 0; i < noteLocRecord.length; i++) {
        squares[noteLocRecord[i][0]].children[noteLocRecord[i][1]].children[param - 1].classList.add('noteRec');
    }
}

const isRight = (on, key) => {
    const squareOn = on.parentNode.dataset.square;
    const onIndex = on.dataset.item;

    if (record[key - 1].find(x => x.toString() == [squareOn, onIndex].toString())) return true;

    return false;
}

/*======= Blank Fillers =======*/

window.addEventListener('keydown', (e) => {
    keyAction(e.key);
})

const numbers = document.querySelectorAll('.number');

numbers.forEach(number => {
    number.addEventListener('click', (e) => {
        keyAction(e.target.textContent);
    })
})

const keyAction = (rawKey) => {
    const on = document.querySelector('.on');
    const key = parseInt(rawKey);
    const cond = (!isNaN(key) && on && key != 0 && !on.classList.contains('def') && block == false);
    const squareOn = parseInt(on.parentNode.dataset.square);
    const onIndex = parseInt(on.dataset.item);

    (notesOn && cond) ? notesAction(on, key) : ((cond) && (isRight(on, key) ? right(on, key, squareOn, onIndex) : wrong(on, key, squareOn, onIndex)));

    if (!notesOn && cond) TONotes(squareOn, onIndex, on, key);
}

const wrong = (on, key, squareOn, onIndex) => {
    if (on.children.length != 0) backToNorm(on, squareOn, onIndex, key);

    on.textContent = key;
    on.classList.add('wrong');
    removePrevious('rec');
    removePrevious('noteRec');
    wcont++;

    history.push([squareOn, onIndex]);
    wcont >= 4 ? (console.log('perdiste, nimodo puta'), block = true) : (mistakes.textContent = `${wcont}/3`);
}

const right = (on, key, squareOn, onIndex) => {
    if (on.children.length != 0) backToNorm(on, squareOn, onIndex, key);

    on.textContent = key;
    on.classList.remove('wrong');
    getOtherNums(key);

    if (!(loggedB4 = noModHistory.find(x => x.toString() == [squareOn, onIndex].toString()))) (rcont++, points.textContent = rcont * 50);

    history.push([squareOn, onIndex]);
    noModHistory.push([squareOn, onIndex]);
    if (rcont >= 43) console.log('ganaste'), block = true;
}

const backToNorm = (on, squareOn, onIndex, target) => {
    for (let i = 0; i < 9; i++) {
        on.children[i].textContent != '' && (remFromNoteLoc(squareOn, onIndex, i + 1))
    }

    on.classList.remove('wn');

    while (on.lastChild) {
        on.removeChild(on.lastChild);
    }

    if (!target) return;

    remFromNoteLoc(squareOn, onIndex, target);
}

const remFromNoteLoc = (squareOn, onIndex, target) => {
    let targetNoteLoc = noteLoc[target - 1].findIndex(x => x.toString() == [squareOn, onIndex].toString());

    noteLoc[target - 1].splice(targetNoteLoc, 1);
}

const TONotes = (squareOn, onIndex, on, key) => {
    const onParent = on.parentNode;
    let noteRemTask = [];

    settingRels(getOtherRels(onIndex + 1), getOtherRels(squareOn + 1), (xquare, sqyare) => {
        const xchild = xquare.children;
        const ychild = sqyare.children;

        if (xchild.length != 0) xchild[key - 1].textContent = '', noteRemTask.push([xquare.parentNode.dataset.square, xquare.dataset.item]);
        if (ychild.length != 0) ychild[key - 1].textContent = '', noteRemTask.push([sqyare.parentNode.dataset.square, sqyare.dataset.item]);
    })

    for (let i = 0; i < 9; i++) {
        const currChild = onParent.children[i].children[key - 1];
        const cCPI = onParent.dataset.square;
        const cCI = onParent.children[i].dataset.item;
        if (currChild) currChild.textContent = '', (!noteRemTask.find(x => x.toString() == [cCPI, cCI].toString()) && noteRemTask.push([cCI, cCPI]));
    }

    for (let i = 0; i < noteRemTask.length; i++) {
        remFromNoteLoc(...noteRemTask[i], key);
    }

    history.push({key, remdNotes: noteRemTask});
}

/*======= Tools =======*/

const eraser = document.querySelector('.eraser');
const hint = document.querySelector('.hint');
const undo = document.querySelector('.undo');
const notes = document.querySelector('.notes');

eraser.addEventListener('click', () => {
    const on = document.querySelector('.on');

    if (on && !on.classList.contains('def')) on.textContent = '', removePrevious('on'), removePrevious('rel'), removePrevious('rec'), removePrevious('noteRec');
})

hint.addEventListener('click', () => {
    let f, s, hint;
    let sub;
    do {
        f = Math.trunc(Math.random() * 9);
        s = Math.trunc(Math.random() * 9);
        sub = squares[f].children[s];
    } while (sub.textContent != '');

    history.push([f, s]);
    noModHistory.push([f, s]);

    for (let i = 0; i < 9; i++) {
        hint = record[i].find(x => x.toString() == [f, s].toString());
        if (hint) sub.textContent = i + 1, sub.classList.add('given'), rcont++;
    }

    removePrevious('on');
    removePrevious('rel');
    removePrevious('rec');
    removePrevious('noteRec');

    sub.classList.add('on');
    getOtherNums(sub.textContent);
    if (rcont == 43) console.log('ganaste');
})

undo.addEventListener('click', () => {
    const uMove = history.pop();

    if (!uMove || rcont == 43) return;

    uMove.key ? reputNotes(uMove.key, uMove.remdNotes) : squares[uMove[0]].children[uMove[1]].textContent = '';

    removePrevious('on');
    removePrevious('rel');
    removePrevious('rec');
    removePrevious('noteRec');
})

const reputNotes = (key, notes) => {
    console.log(notes.length)
    for (let i = 0; i < notes.length; i++) {
        squares[notes[i][0]].children[notes[i][1]].children[key - 1].textContent = key;
    }
}

notes.addEventListener('click', () => {
    notesOn = !notesOn;
    numbers.forEach(number => {
        let currCol = number.children[0].style.color;

        currCol == '' ? number.children[0].style.color = 'rgb(201, 200, 206)' : number.children[0].style.color = '';
    })
})

const notesAction = (on, key) => {
    const squareOn = parseInt(on.parentNode.dataset.square);
    const onIndex = parseInt(on.dataset.item);
    const onChild = on.children[key - 1];

    on.children.length == 0 ? notesCreation(on, key) : onChild.textContent == '' ? onChild.textContent = key : onChild.textContent = '';
    !noteLoc[key - 1].find(x => x.toString() == [squareOn, onIndex].toString()) && noteLoc[key - 1].push([squareOn, onIndex]);
}

const notesCreation = (on, key) => {
    on.textContent = '';
    on.classList.add('wn');

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 9; i++) {
        const fragfrag = document.createElement('div');
        if (key - 1 == i) fragfrag.textContent = key;
        fragment.appendChild(fragfrag);
    }

    on.appendChild(fragment);
}

/*======= Game =======*/

window.addEventListener('load', () => {
    const sudoku = gameFiller();
    record = getNumberRecord(sudoku);
    const defBoard = mergeTables(sudoku, takeOut(43));

    setSquareFormat((x, y, z, w) => {
        if (defBoard[z][w] != 0) squares[x].children[y].textContent = defBoard[z][w], squares[x].children[y].classList.add('def');
    })
})

const gameFiller = () => {
    let sudoku = [];

    for (let i = 0; i < 9; i++) {
        let line = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        do {
            for (let j = 0; j < 9; j++) {
                let f, s;
                f = Math.trunc(Math.random() * 9);
                s = Math.trunc(Math.random() * 9);

                let aux = line[f];
                line[f] = line[s];
                line[s] = aux;
            }
        } while (repeated(line, sudoku));

        sudoku.push(line);
    }

    return sudoku;
}

const repeated = (line, sudoku) => {
    const slen = sudoku.length;
    if (slen == 0) return false;

    for (let i = 0; i < 9; i++) {
        let cont = 0;
        for (let j = 0; j < slen; j++) {
            if (sudoku[j][i] == line[i]) cont++;
        }
        if (cont > 0) return true;
    }

    if (slen == 3 || slen == 6) return false;

    for (let i = 0; i < 9; i++) {
        let fE = i < 3 ? -1 : (i < 6 ? 2 : 5)
        let els = (slen % 3) * 3;
        let cont = 0;

        for (let j = 0; j < els; j++) {
            let pos = j % 3 == 0 ? 3 : j % 3;

            j / 2 > 1 ? (sudoku[slen - 2][pos + fE] == line[i] && cont++) : (sudoku[slen - 1][pos + fE] == line[i] && cont++);
        }

        if (cont > 0) return true;
    }

    return false;
}

const takeOut = (zeros) => {
    let takenOut = [];

    for (let i = 0; i < zeros; i++) {
        let local;
        do {
            f = Math.trunc(Math.random() * 9);
            s = Math.trunc(Math.random() * 9);
            local = [f, s];
        } while (verif = takenOut.find(x => x.toString() == local.toString()));

        takenOut.push(local);
    }

    return takenOut;
}

const mergeTables = (origin, zeros) => {
    for (let i = 0; i < zeros.length; i++) {
        origin[zeros[i][0]][zeros[i][1]] = 0;
    }

    return origin;
}

const getNumberRecord = (sudoku) => {
    let squareFormat = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];

    setSquareFormat((x, y, z, w) => {
        squareFormat[x][y] = sudoku[z][w];
    })

    let record = [[], [], [], [], [], [], [], [], []];

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const loc = squareFormat[i][j] - 1;
            record[loc].push([i, j]);
        }
    }
    return record;
}

const setSquareFormat = (cb) => {
    for (let i = 0; i < 9; i++) {
        let square;
        i > 2 ? (i > 5 ? square = [6, 7, 8] : square = [3, 4, 5]) : (square = [0, 1, 2]);

        let pos;
        (i + 1) % 3 == 1 ? pos = [0, 1, 2] : ((i + 1) % 3 == 2 ? pos = [3, 4, 5] : pos = [6, 7, 8]);

        let cont = 0;
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                cb(square[j], pos[k], i, cont);
                cont++;
            }
        }
    }
}

/*======= Other Functionalities =======*/

const timer = document.querySelector('.timer p');
const stopper = document.querySelector('#stopper');
const blocker = document.querySelector('.blocker');
let time = 0;
let sFlag = true;

setInterval(() => {
    if (sFlag) updateTimer();
}, 1000)

const updateTimer = () => {
    time++;
    let min = (time / 60).toString()[0];
    let seg = (time % 60).toString();

    let cmin = min.length == 1 ? '0' + min : min;
    let cseg = seg.length == 1 ? '0' + seg : seg;

    timer.textContent = `${cmin}:${cseg}`;
}

stopper.addEventListener('click', () => {
    sFlag == true ? setPause() : backToPlay();
    sFlag = !sFlag;
})

const setPause = () => {
    stopper.classList.remove('fa-pause');
    stopper.classList.add('fa-play');
    blocker.style.transform = 'translateX(0%)';
    block = true;
}

const backToPlay = () => {
    stopper.classList.remove('fa-play');
    stopper.classList.add('fa-pause');
    blocker.style.transform = 'translateX(-100%)';
    block = false;
}