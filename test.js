for (let i = 0; i < 9; i++) {
    let square;
    i > 2 ? (i > 5 ? square = [6,7,8] : square = [3,4,5]) : (square = [0,1,2]);

    let pos;
    (i + 1) % 3 == 1 ? pos = [0,1,2] : ((i + 1) % 3 == 2 ? pos = [3,4,5] : pos = [6,7,8]);

    let cont = 0;
    for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
            if (defBoard[i][cont] != 0) squares[square[j]].children[pos[k]].textContent = defBoard[i][cont], squares[square[j]].children[pos[k]].classList.add('def');
            cont++;
        }
    }
}

for (let i = 0; i < 9; i++) {
    let square;
    i > 2 ? (i > 5 ? square = [6,7,8] : square = [3,4,5]) : (square = [0,1,2]);

    let pos;
    (i + 1) % 3 == 1 ? pos = [0,1,2] : ((i + 1) % 3 == 2 ? pos = [3,4,5] : pos = [6,7,8]);

    let cont = 0;
    for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
            squareFormat[square[j]][pos[k]] = sudoku[i][cont];
            cont++;
        }
    }
}