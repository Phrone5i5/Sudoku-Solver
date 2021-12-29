class SudokuSolver {

  validate(puzzleString) {
    const areAllValid = (string) => {
      return string.match(/([1-9]|\.)/g).length == 81 ? true : false;
    }
    if (!puzzleString) {
      return { valid: false, error: 'Required field missing' };
    } else if (typeof puzzleString == 'string' && puzzleString.length == 81 && areAllValid(puzzleString)) {
      return { valid: true };
    } else if (typeof puzzleString == 'string' && puzzleString.length == 81 && !areAllValid(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    } else if (puzzleString.length != 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    } else {
      return { valid: false, error: 'Puzzle cannot be solved'};
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let columnIndex = column - 1; // make column allign with its on board space
    let rows = {
      A: '',
      B: '',
      C: '',
      D: '',
      E: '',
      F: '',
      G: '',
      H: '',
      I: ''
    };
    // Populating the rows object with the current values of each row
    let rowKeys = Object.keys(rows);
    rowKeys.forEach((key, current) => {
      rows[key] = puzzleString.slice(current * 9, (current * 9) + 9);
    });
    // Test the validity of the row, column, and value inputs against the calculated rows
    return rows[row][columnIndex] == '.' && !rows[row].includes(value) ? true : false;
  }

  checkColPlacement(puzzleString, row, column, value) {
    // Function to convert input row letter to number for string indexing
    const getRowNumber = (rowLetter) => {
      return [ ['A', 0], ['B', 1], ['C', 2], ['D', 3], ['E', 4], ['F', 5], ['G', 6], ['H', 7], ['I', 8] ]
             .filter(pair => pair[0] == rowLetter)[0][1];
    }
    let columns = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '' };
    // Populating the columns object with the current values of each column
    let columnKeys = Object.keys(columns);
    columnKeys.forEach((key, outerIndex) => {
      let currentColumn = '';
      for (let innerIndex in columnKeys) {
        currentColumn = currentColumn.concat(puzzleString[(innerIndex * 9) + outerIndex]);
      }
      columns[outerIndex + 1] = currentColumn;
    });
    return columns[column][getRowNumber(row)] == '.' && !columns[column].includes(value) ? true : false;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let result = false;
    let columnIndex = column - 1;
    // A modified of the previous getRowNumber function, specifcally for returning an index for one of three region rows
    const getRowNumber = (rowLetter) => {
      return [ ['A', 0], ['B', 1], ['C', 2], ['D', 0], ['E', 1], ['F', 2], ['G', 0], ['H', 1], ['I', 2] ]
             .filter(pair => pair[0] == rowLetter)[0][1];
    }
    const getColumnIndex = (columnInput) => {
      let index;
      switch (columnInput) {
        case 0 || 3 : index = 0; break;
        case 1 || 4 : index = 1; break;
        case 2 || 5 : index = 2; break;
        case 3 || 6 : index = 0; break;
        case 4 || 7 : index = 1; break;
        case 5 || 8 : index = 2; break;
      }
      return index;
    }
    const regions = {
      topLeft: { regionArr: [], rows: ['A', 'B', 'C'], columns: [1, 2, 3] },
      topCenter: { regionArr: [], rows: ['A', 'B', 'C'], columns: [4, 5, 6] },
      topRight: { regionArr: [], rows: ['A', 'B', 'C'], columns: [7, 8, 9] },
      middleLeft: { regionArr: [], rows: ['D', 'E', 'F'], columns: [1, 2, 3] },
      middleCenter: { regionArr: [], rows: ['D', 'E', 'F'], columns: [4, 5, 6] },
      middleRight: { regionArr: [], rows: ['D', 'E', 'F'], columns: [7, 8, 9] },
      bottomLeft: { regionArr: [], rows: ['G', 'H', 'I'], columns: [1, 2, 3] },
      bottomCenter: { regionArr: [], rows: ['G', 'H', 'I'], columns: [4, 5, 6] },
      bottomRight: { regionArr: [], rows: ['G', 'H', 'I'], columns: [7, 8, 9] }
    };
    let regionKeys = Object.keys(regions);
    regionKeys.forEach((key, current) => {
    	let currentIndex;
      switch (current) {
      	case 0 : currentIndex = 0; break;
       	case 1 : currentIndex = 3; break;
        case 2 : currentIndex = 6; break;
        case 3 : currentIndex = 27; break;
        case 4 : currentIndex = 30;	break;
        case 5 : currentIndex = 33;	break;
        case 6 : currentIndex = 54; break;
        case 7 : currentIndex = 57; break;
        case 8 : currentIndex = 60; break;
      }
      regions[key].regionArr.push(
      	puzzleString.slice(currentIndex, currentIndex + 3), // current region top row
        puzzleString.slice(currentIndex + 9, currentIndex + 12), // current region middle row
        puzzleString.slice(currentIndex + 18, currentIndex + 21) // current region bottom row
      );
    });    
    regionKeys.forEach(key => {
    	if (regions[key].rows.includes(row) && regions[key].columns.includes(column)) {
        if (
          regions[key].regionArr[getRowNumber(row)][getColumnIndex(columnIndex)] == '.' && regions[key].regionArr.filter(row => row.includes(value)).length == 0
        ) {
          result = true;
        }      	
      }
    });
    return result;
  }

  solve(puzzleString) {
    // If initial puzzleString is invalid, exit immediately with error message
    if (this.validate(puzzleString).valid == false) {
      return this.validate(puzzleString);
    }
    // Declare a function that we will call recursively inside of solve until we have a complete and valid puzzleString
    const recursiveSolve = (currentPuzzleString) => {
      // If all columns and rows have been eliminated, return the current string, allowing the stack to return the final string
      if (!currentPuzzleString.length) {
        return currentPuzzleString;
      } else {
        // A function to convert a row number to a letter for checkRow, checkCol, and checkRegion tests
        // *** Letters may need to convert to numbers starting with zero, depending on where rowNumber is being input from ***
        const getRowLetterForChecks = (rowNumber) => {
          return [ ['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5], ['F', 6], ['G', 7], ['H', 8], ['I', 9] ]
                 .filter(pair => pair[1] == rowNumber)[0][0];
        }
        // Setting up an object containing all rows
        let rows = {
          A: '',
          B: '',
          C: '',
          D: '',
          E: '',
          F: '',
          G: '',
          H: '',
          I: ''
        };
        let rowKeys = Object.keys(rows);
        rowKeys.forEach((key, current) => {
          rows[key] = currentPuzzleString.slice(current * 9, (current * 9) + 9);
        });
        // TODO
        // Iterate through columns using a counter and checkColPlacement() until one is found with a blank space (c)
        // Iterate* through the rows using a counter and checkRowPlacement() until one is found with a blank space (r) (should be the same blank as found by checkColPlacement())
            // *1 both iterators should most likely be while loops with dedicated values to break the loop once the values have been set (next step)
        // Use getRowLetterForChecks with the current index to get the correct row letter, and then change that row's value* at the index of the checkColPlacement() iterator
            // *2 This value should be set using another iterator, where if it passes checkColPlacement(), checkRowPlacement(), and checkRegionPlacement(), the value is 1, if not, 2, etc,
            // this may require a rewrite of the functions to either only make rows/columns/regions from however many rows/columns worth of characters are available, or find a way...
            // ...to preserve the original input string, making a temp copy, adding the prospective value at the correct index, and then checking it with all three placement checking...
            // ... functions. 
        // Once the value has been set, we need to remove rows and columns where all values are filled.
        /* For each column (j) (filter columns?) where r[j] = non blank value {
            For each row (i) where i[j] = non blank value {
              delete row i from overall current object
            }
           }
           delete column j from overall current object
        */
        
        // change newInputString to the new string minus the rows/columns/whatever here
        let newInputString = '';

        // the function returns itself with the new puzzle string, bypassing the validate for the entire function,
        // taking us back to line 132...
        return recursiveSolve(newPuzzleString);
      }
    }
    // after recursive function setup, call the function, kicking off the solving process.
    return { solution: recursiveSolve(puzzleString) };
  }
}

module.exports = SudokuSolver;

