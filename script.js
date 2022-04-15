//-1 - cell with bomb
//0 - empty cell
//1,..,6 - cell with neighbourhood bombs
let cells = [];
//-1 - marked cell
//0 - close cell
//1 - open cell
let cellsStatus = [];
const images = {
    'flag': document.createElement('img'),
    'openCell': document.createElement('img'),
    'closeCell': document.createElement('img'),
    'bomb': document.createElement('img'),
    'ccg': document.createElement('img'),
    'background': document.createElement('img'),
}
let firstClick = true;
let remainingMines;
let numberOfFlags = 0;

for (let prop in images) {
    images[prop].src = "img/" + prop + ".png";
}

//arrays declaration
for (let i = 0; i < 12; i++) {
    cells.push([]);
    cellsStatus.push([]);
    for (let j = 0; j < 12; j++) {
        cells[i].push(0);
        cellsStatus[i].push(0);
    }
}

window.onbeforeunload = () => {
    console.log('Leave');
}
window.onload = () => {
    document.getElementById('body').style.backgroundImage = `url("${images['background'].src}")`;
    printField();
    document.getElementById('plusMines').addEventListener('click', changeAmountOfMines);
    document.getElementById('minusMines').addEventListener('click', changeAmountOfMines);
    remainingMines = document.getElementById('amountOfMines').innerHTML;
}
document.oncontextmenu = () => {
    return false;
}

const printField = () => {
    const field = document.getElementById('field');
    field.innerHTML = null;
    for (let i = 1; i <= 100; i++) {
        const x = Math.floor((i - 1) / 10) + 1;
        const y = i - (x - 1) * 10;
        field.insertAdjacentHTML('beforeend',
            `<a class="cell" id="${i}">${cells[x][y]}</a>`);
    }
    for (let cell of document.querySelectorAll('.cell')) {
        cell.addEventListener('click', leftClick);
        cell.addEventListener('contextmenu', rightClick)
    }
}

const changeAmountOfMines = (event) => {
    const amountMines = document.getElementById('amountOfMines');
    printField();
    if (event.target.id === 'plusMines') {
        if (amountMines.innerHTML === '40') {
            amountMines.innerHTML = '0';
        }
        amountMines.innerHTML = +amountMines.innerHTML + 1;
    } else if (event.target.id === 'minusMines') {
        if (amountMines.innerHTML === '1') {
            amountMines.innerHTML = '41';
        }
        amountMines.innerHTML = +amountMines.innerHTML - 1;
    }
    remainingMines = amountMines.innerHTML;
}

const mathRandom = (min, max) => {
    return Math.max(min, Math.floor(Math.random() * (max + 1)));
}

const bombSiteCheck = (x, y) => {
    if (cells[x][y] === -1 || cellsStatus[x][y]) {
        return false;
    }
    let kolNeighbourhoodBombs = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (cells[x + i][y + j] === -1){
                kolNeighbourhoodBombs++;
            }
        }
    }
    return kolNeighbourhoodBombs < 7;
}

const generateField = (x, y) => {
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 12; j++) {
            cells[i][j] = -1;
            cellsStatus[i][j] = 0;
            if (0 < i && i < 11 && 0 < j && j < 11) {
                cells[i][j] = 0;
            }
        }
    }
    let amountOfMines = +document.getElementById('amountOfMines').innerHTML;
    while (amountOfMines) {
        const i = mathRandom(1, 10);
        const j = mathRandom(1, 10);
        if ((Math.abs(x - i) > 1 || Math.abs(y - j) > 1) && bombSiteCheck(i, j)) {
            cells[i][j] = -1;
            amountOfMines--;
        }
    }
    for (let x = 0; x < 12; x++) {
        for (let y = 0; y < 12; y++) {
            if (x < 1 || x > 10 || y < 1 || y > 10) {
                cells[x][y] = 0;
            }
        }
    }
    for (let x = 1; x < 11; x++) {
        for (let y = 1; y < 11; y++) {
            if (cells[x][y] === 0) {
                let kolMines = 0;
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (cells[x + i][y + j] === -1) {
                            kolMines++;
                        }
                    }
                }
                cells[x][y] = kolMines;
            }
        }
    }
}

const openAllCells = () => {
    for (let x = 1; x < 11; x++) {
        for (let y = 1; y < 11; y++) {
            const cell = document.getElementById(`${(x - 1) * 10 + y}`);
            if (cells[x][y] === -1) {
                cell.style.backgroundImage = `url("${images['bomb'].src}")`;
            } else if (cellsStatus[x][y] !== -1) {
                if (cells[x][y]) {
                    cell.style.fontSize = '50px';
                    cell.style.backgroundImage = `url("${images['openCell'].src}")`;
                } else {
                    cell.style.backgroundImage = `url("${images['ccg'].src}")`;
                }
            }
        }
    }
}

const leftClick = (event) => {
    const x = Math.floor((+event.target.id - 1) / 10) + 1;
    const y = +event.target.id - (x - 1) * 10;
    if (firstClick) {
        document.getElementById('plusMines').hidden = true;
        document.getElementById('minusMines').hidden = true;
        remainingMines = +document.getElementById('amountOfMines').innerHTML;
        firstClick = false;
        numberOfFlags = 0;
        generateField(x, y);
        printField();
    }
    if (cells[x][y] === -1) {
        alert('Lose');
        document.getElementById('plusMines').hidden = false;
        document.getElementById('minusMines').hidden = false;
        openAllCells();
        firstClick = true;
        return;
    }
    openCells(x, y, true);
}

const neighbourWithoutMine = (x, y) => {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (!cells[x + i][y + j] && cellsStatus[x + i][y + j] === 1) {
                return true;
            }
        }
    }
    return false;
}

const openCells = (x, y, firstCell) => {
    if (x < 1 || x > 10 || y < 1 || y > 10 || cellsStatus[x][y] !== 0 || cells[x][y] === -1) {
        return;
    }
    if (!neighbourWithoutMine(x, y) && !firstCell) {
        return;
    }
    firstCell = false;
    cellsStatus[x][y] = 1;
    const cell = document.getElementById((x - 1) * 10 + y);
    if (cells[x][y]) {
        cell.style.fontSize = '50px';
        cell.style.backgroundImage = `url("${images['openCell'].src}")`;
    } else {
        cell.style.backgroundImage = `url("${images['ccg'].src}")`;
    }
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            openCells(x + i, y + j, firstCell);
        }
    }
}

const rightClick = (event) => {
    if (firstClick) {
        return false;
    }
    const x = Math.floor((+event.target.id - 1) / 10) + 1;
    const y = +event.target.id - (x - 1) * 10;
    if (!cellsStatus[x][y]) {
        event.target.style.backgroundImage = `url("${images['flag'].src}")`;
        cellsStatus[x][y] = -1;
        numberOfFlags++;
        if (cells[x][y] === -1) {
            remainingMines--;
        }
    } else if (cellsStatus[x][y] === -1) {
        event.target.style.backgroundImage = `url("${images['closeCell'].src}")`;
        cellsStatus[x][y] = 0;
        numberOfFlags--;
        if (cells[x][y] === -1) {
            remainingMines++;
        }
    }
    console.log(remainingMines, numberOfFlags);
    if (!remainingMines && numberOfFlags === +document.getElementById('amountOfMines').innerHTML) {
        alert('You win');
        document.getElementById('plusMines').hidden = false;
        document.getElementById('minusMines').hidden = false;
        openAllCells();
        firstClick = true;
    }

}
