// main logic
window.onload = (() => {
    console.log("Start");
    window.board = [
        ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0"]
    ];


    // let boardElem = resetBoard();
    // let gameElem = document.getElementById("game");

    // [boardElem, inputs] = drawBoard(boardElem, board);

    // gameElem.appendChild(boardElem);
    let inputs = renderSudoku(window.board);

    // Add submit callback
    submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", function () {
        if (isValidSudoku(board)) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/submit_sudoku", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(window.board));
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 2) {
                    alert("Adding sudoku success!");
                    // reload the page
                    location.reload();
                }
                else if (xhr.readyState == 4 && xhr.status == 3) {
                    alert("Adding sudoku failed!");
                }
            }
        }
        else {
            alert("Invalid sudoku!");
        }
    });

    initInputs(inputs);

})
