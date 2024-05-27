document.addEventListener("DOMContentLoaded", function () {
    var rows = 10;
    var cols = 10;
    var mines = 10;
    var grid = [];
    for (var i = 1; i <= rows; i++) {
        var array = [];
        for (var j = 1; j <= cols; j++) {
            array.push(0);
        }
        grid.push(array);
    }
    console.log(grid);
    var visible = [];
    for (var i = 1; i <= rows; i++) {
        var array = [];
        for (var j = 1; j <= cols; j++) {
            array.push(false);
        }
        visible.push(array);
    }
    var flags = [];
    for (var i = 1; i <= rows; i++) {
        var array = [];
        for (var j = 1; j <= cols; j++) {
            array.push(false);
        }
        flags.push(array);
    }
    function placeMines(grid, mines) {
        var placedMines = 0;
        while (placedMines < mines) {
            var r = Math.floor(Math.random() * rows);
            var c = Math.floor(Math.random() * cols);
            if (grid[r][c] !== -1) {
                grid[r][c] = -1;
                placedMines++;
            }
        }
    }
    function calculateNumbers(grid) {
        var directions = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
        ];
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                if (grid[r][c] === -1)
                    continue;
                var count = 0;
                for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
                    var _a = directions_1[_i], dr = _a[0], dc = _a[1];
                    var nr = r + dr;
                    var nc = c + dc;
                    if (nr >= 0 &&
                        nr < rows &&
                        nc >= 0 &&
                        nc < cols &&
                        grid[nr][nc] === -1) {
                        count++;
                    }
                }
                grid[r][c] = count;
            }
        }
    }
    function uncoverCell(r, c) {
        if (r < 0 ||
            r >= rows ||
            c < 0 ||
            c >= cols ||
            visible[r][c] ||
            flags[r][c])
            return;
        visible[r][c] = true;
        if (grid[r][c] === 0) {
            var directions = [
                [-1, -1],
                [-1, 0],
                [-1, 1],
                [0, -1],
                [0, 1],
                [1, -1],
                [1, 0],
                [1, 1],
            ];
            for (var _i = 0, directions_2 = directions; _i < directions_2.length; _i++) {
                var _a = directions_2[_i], dr = _a[0], dc = _a[1];
                uncoverCell(r + dr, c + dc);
            }
        }
        render();
        if (grid[r][c] === -1) {
            alert("Game Over!");
            revealAllMines();
        }
        else if (checkWin()) {
            alert("You win!");
        }
    }
    function markCell(r, c) {
        if (visible[r][c])
            return;
        flags[r][c] = !flags[r][c];
        render();
    }
    function revealAllMines() {
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                if (grid[r][c] === -1) {
                    visible[r][c] = true;
                }
            }
        }
        render();
    }
    function checkWin() {
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                if (grid[r][c] !== -1 && !visible[r][c]) {
                    return false;
                }
            }
        }
        return true;
    }
    function render() {
        var table = document.createElement("table");
        var _loop_1 = function (r) {
            var row = document.createElement("tr");
            var _loop_2 = function (c) {
                var cell = document.createElement("td");
                cell.addEventListener("click", function () { return uncoverCell(r, c); });
                cell.addEventListener("contextmenu", function (e) {
                    e.preventDefault();
                    markCell(r, c);
                });
                if (flags[r][c]) {
                    cell.classList.add("flag");
                }
                else if (visible[r][c]) {
                    cell.classList.add("revealed");
                    if (grid[r][c] === -1) {
                        cell.classList.add("mine");
                    }
                    else if (grid[r][c] > 0) {
                        cell.textContent = grid[r][c].toString();
                    }
                }
                else {
                    cell.classList.add("hidden");
                }
                row.appendChild(cell);
            };
            for (var c = 0; c < cols; c++) {
                _loop_2(c);
            }
            table.appendChild(row);
        };
        for (var r = 0; r < rows; r++) {
            _loop_1(r);
        }
        var container = document.getElementById("minesweeper");
        container.innerHTML = "";
        container.appendChild(table);
    }
    placeMines(grid, mines);
    calculateNumbers(grid);
    render();
});
