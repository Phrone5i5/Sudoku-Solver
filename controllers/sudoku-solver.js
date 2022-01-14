const { header } = require('express/lib/request');
const LinkedList = require('./doubly-circular-linked-list');
const Node = LinkedList.Node;
const DoublyLinkedList = LinkedList.DoublyLinkedList;

class SudokuSolver {
  getRowNumber(rowLetter) {
    const rowPairs = [ ['A', 0], ['B', 1], ['C', 2], ['D', 3], ['E', 4], ['F', 5], ['G', 6], ['H', 7], ['I', 8] ];
    let isValidLetter = rowPairs.filter(pair => pair[0] == rowLetter).length == 1 ? true : false;
    return isValidLetter == true ? rowPairs.filter((pair) => pair[0] == rowLetter)[0][1] : null;
  }

  validate(puzzleString) {
    // Basic length and character checking
    let hasValidLength = puzzleString.length == 81 ? true : false;
    let hasValidChars = puzzleString.match(/([1-9]|\.)/g).length == 81 ? true : false;

    if (hasValidLength == false) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' }
    }
    if (hasValidChars == false) {
      return { valid: false, error: 'Invalid characters in puzzle' }
    }

    // Checking for unsolvable puzzles
    let validationGrid = new DoublyLinkedList('head');
    validationGrid.createSudokuGrid(puzzleString);
    if (validationGrid.isValidPuzzle() == false) {
      return { valid: false, error: 'Puzzle cannot be solved' };
    } else if (validationGrid.isValidPuzzle() == true) {
      return { valid: true };
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let currSudokuGrid = new DoublyLinkedList('head');
    currSudokuGrid.createSudokuGrid(puzzleString);
    let rowsArr = currSudokuGrid.getRowStrings();
    if (rowsArr[this.getRowNumber(row)][column - 1]  == value) {
      return true;
    }
    return rowsArr[this.getRowNumber(row)][column - 1] == '.' && !rowsArr[this.getRowNumber(row)].includes(value) ? true : false;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let currSudokuGrid = new DoublyLinkedList('head');
    currSudokuGrid.createSudokuGrid(puzzleString);
    let colsArr = currSudokuGrid.getColStrings();
    if (colsArr[column -1][this.getRowNumber(row)] == value) {
      return true;
    }
    return colsArr[column - 1][this.getRowNumber(row)] == '.' && !colsArr[column - 1].includes(value) ? true : false;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let result = { region: '', valid: false };
    let currSudokuGrid = new DoublyLinkedList('head');
    currSudokuGrid.createSudokuGrid(puzzleString);

    let regionNodes = currSudokuGrid.getRegion(column, row);
    regionNodes.forEach(node => {
      if (node.rowID == row && node.header == column && node.value == value) {
        result = { valud: true };
      }
      if (node.rowID == row && node.header == column) {
        result.region = node.region;
        if (node.value == '.' || node.mutable == true) {
          let nodesMatchingValue = regionNodes.filter(node => node.value == value ? true : false);
          result.valid = nodesMatchingValue.length == 0 ? true : false;
        }
      }
    });
    return result;
  }

  solve(puzzleString) {
    // If initial puzzleString is invalid, exit immediately with error message /* Do we need to validate here if we are already validating in the API route? */
    if (this.validate(puzzleString).valid == false) {
      return this.validate(puzzleString);
    }
    // Initialize the Sudoku string into a circularly double linked list, making it easier to use
    let SudokuGrid = new DoublyLinkedList('head');
    SudokuGrid.createSudokuGrid(puzzleString);
    let rowStrings = SudokuGrid.getRowStrings();

    const DLXSolve = (strings, showSteps) => {
      let headers, solutions = [], O = [];
      // Basic DLX functions
      const search = (k) => {
        var c, r;
        if (headers.right === headers) {
            solutions.push(copySolution());
            return;
        }
        if (showSteps) {
            solutions.push(copySolution());
        }
        c = smallestColumn();
        cover(c);
        r = c.down;
        while (r !== c) {
          O.push(printRow(r));
          r = r.right;
          while (r.col !== c) {
            cover(r.col);
            r = r.right;
          }
          search(k + 1);
          r = r.left;
          while (r.col !== c) {
            uncover(r.col);
            r = r.left;
          }
          r = r.down;
          O.pop();
        }
        uncover(c);
      }

      const cover = (c) => {
        var r = c.down;
        c.right.left = c.left;
        c.left.right = c.right;
        while (r !== c) {
            r = r.right;
            while (r.col !== c) {
                r.up.down = r.down;
                r.down.up = r.up;
                r.col.size--;
                r = r.right;
            }
            r = r.down;
        }
      }

      const uncover = (c) => {
        var r = c.up;
        c.right.left = c;
        c.left.right = c;
        while (r !== c) {
            r = r.left;
            while (r.col !== c) {
                r.up.down = r;
                r.down.up = r;
                r.col.size++;
                r = r.left;
            }
            r = r.up;
        }
      }

      const smallestColumn = () => {
        var h, c, s = Number.MAX_VALUE;
        h = headers.right;
        while (h !== headers) {
            if (h.size < s) {
                c = h;
                s = c.size;
            }
            h = h.right;
        }
        return c;
      }

      const printRow = (r) => {
        var s = r.col.name + ' ', e = r;
        r = r.right;
        while (r !== e) {
            s += r.col.name + ' ';
            r = r.right;
        }
        return s;
      }

      const copySolution = () => {
        var solution = [].concat(O);
        return solution;
      }

      const toSudokuString = (solution) => {
        var positions = [], i, j, k, d;
        for (i = 0; i < 9; i++) {
            positions[i] = ['.', '.', '.','.', '.', '.','.', '.', '.'];
        }
    
        for (i = 0; i < solution.length; i++) {
            var position = /p(\d)(\d)/.exec(solution[i]);
            d = parseInt(/r\d(\d)/.exec(solution[i])[1]) + 1;
            j = position[1];
            k = position[2];
            positions[j][k] = d;
        }
        return positions.map(function(v) {return v.join("");});;
    }
      // Create the columns / rows for the DLX matrix
      const initializeHeaders = () => {
        let rows = [],
            cols = [],
            grps = [],
            positions = [],
            rawHeaders = [],
            rawRows = [],
            i, j, k;
        const header = (name) => {
          var h = {
            name: name,
            up: null,
            down: null,
            left: null,
            right: null,
            size: 0
          };
          h.up = h;
          h.down = h;
          return h;
        }
        const cell = (colName) => {
          let newCell = {
            up: null,
            down: null,
            left: null,
            right: null,
            col: null
          },  col = rawHeaders[0];

          while (col.name !== colName)
            col = col.right;

          col.size++;
          newCell.down = col;
          newCell.up = col.up;
          newCell.down.up = newCell;
          newCell.up.down = newCell;
          newCell.col = col;
          return newCell;
        }
        // Initialize data
        for (let i = 0; i < 9; i++) {
          rows[i] = [];
          cols[i] = [];
          grps[i] = [];
          positions[i] = [];
          for (let j = 0; j < 9; j++) {
            rows[i][j] = 0;
            cols[i][j] = 0;
            grps[i][j] = 0;
            positions[i][j] = 0;
          }
        }
        // Read in board data
        for (i = 0; i < 9; i++) {
          for (j = 0; j < 9; j++) {
              var curValue = strings[i].charAt(j);
              if (curValue && curValue !== '.') {
                  curValue--;
                  var g = Math.floor(i/3)*3 + Math.floor(j/3);
                  if (rows[i][curValue]) throw "Duplicate values in row";
                  if (cols[j][curValue]) throw "Duplicate values in col";
                  if (grps[g][curValue]) throw "Duplicate values in group.";
                  rows[i][curValue] = 1;
                  cols[j][curValue] = 1;
                  grps[g][curValue] = 1;
                  positions[i][j] = 1;
              }
          }
        }
        // Generate Headers
        rawHeaders.push(header("root"));
        for (i = 0; i < 9; i++) {
            for (j = 0; j < 9; j++) {
                if (!positions[i][j]) {
                    rawHeaders.push(header("p"+i.toString()+j.toString()));
                }
            }
        }
        for (i = 0; i < 9; i++) {
            for (k = 0; k < 9; k++) {
                if (!rows[i][k])
                    rawHeaders.push(header("r"+i.toString()+k.toString()));
                if (!cols[i][k])
                    rawHeaders.push(header("c"+i.toString()+k.toString()));
                if (!grps[i][k])
                    rawHeaders.push(header("g"+i.toString()+k.toString()));
            }
        }
        
        //Now, link them up.
        for (i = 1; i < rawHeaders.length; i++) {
            var h = rawHeaders[i];
            h.left = rawHeaders[i-1];
            rawHeaders[i - 1].right = h;
        }
        rawHeaders[0].left = rawHeaders[rawHeaders.length - 1];
        rawHeaders[rawHeaders.length - 1].right = rawHeaders[0];
        headers = rawHeaders[0];
      
        // Generate Rows
        for (i = 0; i < 9; i++) {
          var x = Math.floor(i/3) * 3;
          for (j = 0; j < 9; j++) {
              if (!positions[i][j]) {
                  var g = x + Math.floor(j/3);
                  for (k = 0; k < 9; k++) {
                      if (!rows[i][k] && !cols[j][k] && !grps[g][k]) {
                          rawRows.push(cell("p"+i.toString()+j.toString()));
                          rawRows.push(cell("r"+i.toString()+k.toString()));
                          rawRows.push(cell("c"+j.toString()+k.toString()));
                          rawRows.push(cell("g"+g.toString()+k.toString()));
                      }
                  }
              }
          }
        }
      
        //Now, link up the rows.  (Cheating, and simply linking up all groups of 4.)
        for (i = 0; i < rawRows.length; i+=4) {
            var a = rawRows[i],
                b = rawRows[i+1],
                c = rawRows[i+2],
                d = rawRows[i+3];
            a.right = b;
            b.right = c;
            c.right = d;
            d.right = a;
            a.left = d;
            b.left = a;
            c.left = b;
            d.left = c;
        }
      }

      initializeHeaders();
      search(0);

      if (solutions) {
        let solutionString = toSudokuString(solutions[0]).join('');
        let returnString = 
          ''.concat(puzzleString)
          .split('')
          .map((val, i) => {
            return val != '.' ? val : solutionString[i];
          })
          .join('');        
        return returnString;
      }
    };
    return { solution: DLXSolve(rowStrings) };
  }
}

module.exports = SudokuSolver;