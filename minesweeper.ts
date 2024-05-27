document.addEventListener("DOMContentLoaded", () => {
  const rows = 10;
  const cols = 10;
  const mines = 10;

  type Grid = number[][];
  type BooleanGrid = boolean[][];

  const grid: Grid = [];
  for (let i = 1; i <= rows; i++) {
    let array = [];
    for (let j = 1; j <= cols; j++) {
      array.push(0);
    }
    grid.push(array);
  }

  console.log(grid);

  const visible: BooleanGrid = [];
  for (let i = 1; i <= rows; i++) {
    let array = [];
    for (let j = 1; j <= cols; j++) {
      array.push(false);
    }
    visible.push(array);
  }

  const flags: BooleanGrid = [];
  for (let i = 1; i <= rows; i++) {
    let array = [];
    for (let j = 1; j <= cols; j++) {
      array.push(false);
    }
    flags.push(array);
  }

  function placeMines(grid: Grid, mines: number): void {
    let placedMines = 0;
    while (placedMines < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (grid[r][c] !== -1) {
        grid[r][c] = -1;
        placedMines++;
      }
    }
  }

  function calculateNumbers(grid: Grid): void {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === -1) continue;
        let count = 0;
        for (const [dr, dc] of directions) {
          const nr = r + dr;
          const nc = c + dc;
          if (
            nr >= 0 &&
            nr < rows &&
            nc >= 0 &&
            nc < cols &&
            grid[nr][nc] === -1
          ) {
            count++;
          }
        }
        grid[r][c] = count;
      }
    }
  }

  function uncoverCell(r: number, c: number): void {
    if (
      r < 0 ||
      r >= rows ||
      c < 0 ||
      c >= cols ||
      visible[r][c] ||
      flags[r][c]
    )
      return;
    visible[r][c] = true;
    if (grid[r][c] === 0) {
      const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];
      for (const [dr, dc] of directions) {
        uncoverCell(r + dr, c + dc);
      }
    }
    render();
    if (grid[r][c] === -1) {
      alert("Game Over!");
      revealAllMines();
    } else if (checkWin()) {
      alert("You win!");
    }
  }

  function markCell(r: number, c: number): void {
    if (visible[r][c]) return;
    flags[r][c] = !flags[r][c];
    render();
  }

  function revealAllMines(): void {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === -1) {
          visible[r][c] = true;
        }
      }
    }
    render();
  }

  function checkWin(): boolean {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] !== -1 && !visible[r][c]) {
          return false;
        }
      }
    }
    return true;
  }

  function render(): void {
    const table = document.createElement("table");
    for (let r = 0; r < rows; r++) {
      const row = document.createElement("tr");
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement("td");
        cell.addEventListener("click", () => uncoverCell(r, c));
        cell.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          markCell(r, c);
        });

        if (flags[r][c]) {
          cell.classList.add("flag");
        } else if (visible[r][c]) {
          cell.classList.add("revealed");
          if (grid[r][c] === -1) {
            cell.classList.add("mine");
          } else if (grid[r][c] > 0) {
            cell.textContent = grid[r][c].toString();
          }
        } else {
          cell.classList.add("hidden");
        }

        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    const container = document.getElementById("minesweeper")!;
    container.innerHTML = "";
    container.appendChild(table);
  }

  placeMines(grid, mines);
  calculateNumbers(grid);
  render();
});
