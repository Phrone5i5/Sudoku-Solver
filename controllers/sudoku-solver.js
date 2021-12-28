class SudokuSolver {

  validate(puzzleString) {
    const areAllValid = (string) => {
      return string.match(/([1-9]|\.)/g).length == 81 ? true : false;
    }
    if (typeof puzzleString == 'string' && puzzleString.length == 81 && areAllValid(puzzleString)) {
      return 'valid';
    } else if (typeof puzzleString == 'string' && puzzleString.length == 81 && !areAllValid(puzzleString)) {
      return 'invalid characters';
    } else {

    }
  }
  /*
    Could row, column, and region checking be optimized by stopping once row/column/region containing the coordinate to input the value has been completed?
  */
  checkRowPlacement(puzzleString, row, column, value) {
    column = column--; // make column allign with its on board space
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
    return rows[row][column] == '.' && !rows[row].includes(value) ? true : false;
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
    // A modified of the previous getRowNumber function, specifcally for returning an index of three rows
    const getRowNumber = (rowLetter) => {
      return [ ['A', 0], ['B', 1], ['C', 2], ['D', 0], ['E', 1], ['F', 2], ['G', 0], ['H', 1], ['I', 2] ]
             .filter(pair => pair[0] == rowLetter)[0][1];
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
    regionKeys = Object.keys(regions);
    regionKeys.forEach((key, current) => {
    	let currentIndex;
      switch (current) {
      	case 0 : currentIndex = 0;
          break;
       	case 1 : currentIndex = 3;
          break;
        case 2 : currentIndex = 6;
        	break;
        case 3 : currentIndex = 27;
        	break;
        case 4 : currentIndex = 30;
        	break;
        case 5 : currentIndex = 33;
        	break;
        case 6 : currentIndex = 54;
        	break;
        case 7 : currentIndex = 57;
        	break;
        case 8 : currentIndex = 60;
        	break;
      }
      regions[key].regionArr.push(
      	puzzleString.slice(currentIndex, currentIndex + 3), // current region top row
        puzzleString.slice(currentIndex + 9, currentIndex + 12), // current region middle row
        puzzleString.slice(currentIndex + 18, currentIndex + 21) // current region bottom row
      );
    });
    let result = false;
    regionKeys.forEach(key => {
    	if (regions[key].rows.includes(row) && regions[key].columns.includes(column)) {
      	// TODO
        // check to see if the regionArr row that corresponds to the entered row has a '.' at the column value index,
        // and that no other space in the regionArr contains the input value 
        if (regions[key].regionArr[getRowNumber(row)][column - 1] == '.') {
          result = true;
        }      	
      }
    });
    return result;
  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

