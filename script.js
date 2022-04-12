//-1 - cell with bomb
//0 - empty cell
//1,..,6 - cell with neighbourhood bombs
let cells = [];
//-1 - marked cell
//0 - close cell
//1 - open cell
let cellsStatus = [];

const onLoad = () => {
    preloadImages(['img/dirt.jpg', 'img/flag.png', 'img/grass.png',
        'img/whenLose.jpg', 'img/whenWin.jpg', 'img/Безымянный.png']);
    printField();
    addEvents();
}

const offContextMenu = () => {
    return false;
}

window.onload = onLoad;
document.oncontextmenu = offContextMenu;

const preloadImages = (images) => {
    for (let img of images) {
        let curImg = document.createElement('img');
        curImg.src = img;
    }
}

const addEvents = () => {
    document.getElementById('plusMines').addEventListener('click', plusMines);
    document.getElementById('minusMines').addEventListener('click', minusMines);
    for (let cell of document.querySelectorAll('.cell')) {
        cell.addEventListener('click', clickOnCell);
        cell.addEventListener('contextmenu', clickOnCell)
    }
}

const printField = () => {
    const field = document.getElementById('field');
    for (let i = 1; i <= 100; i++) {
        field.insertAdjacentHTML('beforeend', `<a class="cell" id="${i}"></a>`);
    }
}

const plusMines = () => {
    const amountMines = document.getElementById('amountOfMines');
    if (amountMines.innerHTML === '99') {
        return false;
    }
    amountMines.innerHTML = +amountMines.innerHTML + 1;
}

const minusMines = () => {
    const amountMines = document.getElementById('amountOfMines');
    if (amountMines.innerHTML === '1') {
        return false;
    }
    amountMines.innerHTML = +amountMines.innerHTML - 1;
}

const mathRandom = (min, max) => {
    return Math.max(min, Math.floor(Math.random() * (max + 1)));
}

const declareOfArray = () => {
    for (let i = 0; i < 12; i++) {
        cells.push([]);
        cellsStatus.push([]);
        for (let j = 0; j < 12; j++) {
            cells[i].push(-1);
            cellsStatus[i].push(0);
            if (0 < i && i < 11 && 0 < j && j < 11) {
                cells[i][j] = 0;
            }
        }
    }
}

const bombSiteCheck = (x, y) => {
    if (cells[x][y] === -1 || cellsStatus[x][y]) {
        return false;
    }
    let kolNeighbourhoodBombs = -cells[x - 1][y - 1] - cells[x - 1][y] - cells[x - 1][y + 1]
        - cells[x][y - 1] - cells[x][y + 1]
        - cells[x + 1][y - 1] - cells[x + 1][y] - cells[x + 1][y + 1];
    return kolNeighbourhoodBombs < 7;
}

const generateField = () => {
    let amountOfMines = +document.getElementById('amountOfMines').innerHTML;
    while (amountOfMines) {
        const x = mathRandom(1, 10);
        const y = mathRandom(1, 10);

        if (bombSiteCheck(x, y)) {
            cells[x][y] = -1;
            amountOfMines--;
        }
    }
}

const leftClick = (event) => {
    const x = Math.floor((+event.target.id - 1) / 10) + 1;
    const y = +event.target.id - (x - 1) * 10;
    if (!cells.length) {
        declareOfArray();
        cellsStatus[x][y] = 1;
        generateField();
        cellsStatus[x][y] = 0;
        console.log(cells);
    }
    if (cellsStatus[x][y]) {
        return;
    }
    event.target.style.backgroundImage = "url('img/dirt.jpg')"
    cellsStatus[x][y] = 1;
}

const rightClick = (event) => {
    const x = Math.floor((+event.target.id - 1) / 10) + 1;
    const y = +event.target.id - (x - 1) * 10;
    if (!cellsStatus[x][y]) {
        event.target.style.backgroundImage = "url('img/flag.png')";
        cellsStatus[x][y] = -1;
    } else if (cellsStatus[x][y] === -1) {
        event.target.style.backgroundImage = "url('img/grass.png')";
        cellsStatus[x][y] = 0;
    }
}

const clickOnCell = (event) => {
    if (event.type === 'click') {
        leftClick(event);
    } else if (event.type === 'contextmenu') {
        rightClick(event);
    }
}