class SudokuSolver {

  validate(puzzleString) {
    const areAllValid = (string) => {
      return string.match(/([1-9]|\.)/g).length == 81 ? true : false;
    }
    if (typeof puzzleString == 'string' && puzzleString.length == 81 && areAllValid(puzzleString)) {
      return { valid: true };
    } else if (typeof puzzleString == 'string' && puzzleString.length == 81 && !areAllValid(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    } else {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
  }
  /*
    Could row, column, and region checking be optimized by stopping once row/column/region containing the coordinate to input the value has been completed?
  */
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
    let startIndex = 0;
    let rowKeys = Object.keys(rows);
    rowKeys.forEach((key) => {
      rows[key] = puzzleString.slice(startIndex * 9, (startIndex * 9) + 9);
      startIndex++;
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
    console.log('made it this far 1');
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
    console.log('made it this far 2');
    // See below note, and then: Object.getOwnPropertyNames() is also not working, making me think the issue is with either the Object methods, or with Node's handling of them
    console.log(Object.getOwnPropertyNames());
    // Either Node.js or something else is having an issue with Object.keys(regions), as it does not display to console, and execution stops immediately after it's called.
    regionKeys = Object.keys(regions);
    console.log(Object.keys(regions));
    regionKeys.forEach((key, current) => {
      console.log('made it this far 3');
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
    console.log('made it this far 4');
    
    regionKeys.forEach(key => {
      console.log('made it this far 5');
    	if (regions[key].rows.includes(row) && regions[key].columns.includes(column)) {
        console.log('made it this far 6');
        console.log(regions[key].regionArr);
        console.log(regions[key].regionArr.filter(row => row.includes(String(value))));
        if (
          regions[key].regionArr[getRowNumber(row)][getColumnIndex(columnIndex)] == '.' && regions[key].regionArr.filter(row => row.includes(value)).length == 0
        ) {
          console.log('made it this far 7');
        result = true;
        }      	
      }
    });
    console.log('made it this far 8');
    return result;
  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

