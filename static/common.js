// Common helpers/utils
function isAllFilledSudoku(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] == '0') {
                return false;
            }
        }
    }
    return true;
}



function isValidSudoku(board) {
    // modified from https://blog.csdn.net/Shannon_zhazha/article/details/121171111
    // 三个方向判重
    const [rows, columns, boxes] = [{}, {}, {}];
    // console.log(rows)
    // 遍历数独
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const num = board[i][j];
            if (num !== '0') {
                // 子数独序号:0~8，一共9个
                const boxIndex = parseInt(i / 3) * 3 + parseInt(j / 3);
                // 如果当前数已经在某个位置出现过了，返回false

                if (rows[i + '-' + num] || columns[j + '-' + num] || boxes[boxIndex + '-' + num]) {
                    return false;
                }
                // 三个方向上每个位置，将当前数做标记，表示出现过了
                rows[i + '-' + num] = true;
                // console.log(rows)
                columns[j + '-' + num] = true;
                console.log(columns)
                boxes[boxIndex + '-' + num] = true;
            }
        }
    }
    return true;
};
function getInvalidSudoku(board) {
    // Rows
    invalid_rows = []
    for (let i = 0; i < 9; i++) {
        let row = [];
        for (let j = 0; j < 9; j++) {
            if (board[i][j] != "0" && row.includes(board[i][j])) {
                invalid_rows.push(i);
                break;
            }
            row.push(board[i][j]);
        }
    }
    // Columns
    invalid_columns = []
    for (let i = 0; i < 9; i++) {
        let col = [];
        for (let j = 0; j < 9; j++) {
            if (board[j][i] != "0" && col.includes(board[j][i])) {
                invalid_columns.push(i);
                break;
            }
            col.push(board[j][i]);
        }
    }
    // Boxes
    invalid_boxes = []
    for (let i = 0; i < 9; i++) {
        let box = [];
        for (let j = 0; j < 9; j++) {
            let row = parseInt(i / 3) * 3 + parseInt(j / 3);
            let col = (i % 3) * 3 + j % 3;
            if (board[row][col] != "0" && box.includes(board[row][col])) {
                invalid_boxes.push(i);
                break;
            }
            box.push(board[row][col]);
        }
    }
    return [invalid_columns, invalid_rows, invalid_boxes];
}

function resetBoard() {
    // if exists a board, remove it and create a new one
    let board_elem = document.getElementById("board");
    if (board_elem) { board_elem.remove(); }

    board_elem = document.createElement("table");
    board_elem.setAttribute("id", "board");
    board_elem.setAttribute("class", "board");
    return board_elem;
}

function drawBoard(boardElem, board) {
    let inputs = [];
    for (let i = 0; i < 9; i++) {
        tr = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            td = document.createElement("td");
            td.setAttribute("id", "grid-" + i + "-" + j);
            const value = board[i][j];
            td.setAttribute("class", "grid-show");
            if (value != "0") {
                td.innerHTML = value;
            }
            else {
                var ginput = document.createElement("input");
                ginput.setAttribute("id", "input-" + i + "-" + j);
                ginput.setAttribute("class", "grid-input");
                inputs.push(ginput);
                td.appendChild(ginput);
            }
            tr.appendChild(td);
        }
        boardElem.appendChild(tr);
    }
    return [boardElem, inputs];
}

function resetGridBackground() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let grid = document.getElementById("grid-" + i + "-" + j);
            grid.style.backgroundColor = "white";
        }
    }
}

function renderInvalidSudoku(board) {
    let [invalid_columns, invalid_rows, invalid_boxes] = getInvalidSudoku(board);
    console.log(invalid_columns, invalid_rows, invalid_boxes);
    invalid_rows.forEach(element => {
        // Render i-th row red
        for (let i = 0; i < 9; i++) {
            let grid = document.getElementById("grid-" + element + "-" + i);
            grid.style.backgroundColor = "#f5a4c6";
        }
    });
    invalid_columns.forEach(element => {
        // Render i-th column red
        for (let i = 0; i < 9; i++) {
            let grid = document.getElementById("grid-" + i + "-" + element);
            grid.style.backgroundColor = "#f5a4c6";
        }
    });
    invalid_boxes.forEach(element => {
        // Render i-th box red
        for (let i = 0; i < 9; i++) {
            let row = parseInt(element / 3) * 3 + parseInt(i / 3);
            let col = (element % 3) * 3 + i % 3;
            let grid = document.getElementById("grid-" + row + "-" + col);
            grid.style.backgroundColor = "#f5a4c6";
        }
    });
}

function renderSudoku(board) {
    let boardElem = resetBoard();
    let gameElem = document.getElementById("game");
    [boardElem, inputs] = drawBoard(boardElem, board);
    gameElem.appendChild(boardElem);
    return inputs
}

function getBoard() {
    // Get board from server
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/get_sudoku", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let board = JSON.parse(xhr.responseText);
            window.board = board;
            console.log(board);
            let inputs = renderSudoku(board);
            initInputs(inputs);
            initInputsFinished(inputs);
            // reset restart image
            document.getElementById("restart").style.display = 'none';
        }
    }
    xhr.send();

}

function initInputs(inputs) {
    // Add input callback for all inputs
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("change", function () {
            let value = inputs[i].value;
            let row = parseInt(inputs[i].id.split("-")[1]);
            let col = parseInt(inputs[i].id.split("-")[2]);
            if (value.length == 1 && value >= '1' && value <= '9') {
                window.board[row][col] = value;
                if (!isValidSudoku(window.board)) {
                    console.log("Invalid Sudoku");
                    resetGridBackground();
                    renderInvalidSudoku(window.board);
                }else{
                    resetGridBackground();
                }
            }
            else if (value.length == 0) {
                window.board[row][col] = "0";
                resetGridBackground();
            }
            else {
                // invalid input
                inputs[i].value = "";
                alert('Invalid input!');
            }
        });
    }
}

function initInputsFinished(inputs) {
    // check if all inputs are filled and sudoku is finished
    // and display restart image 
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("change", function () {
            if (isAllFilledSudoku(window.board) && isValidSudoku(window.board)) {
                // Show restart image
                document.getElementById("restart").style.display = "block";
            }
        });
    }
}

