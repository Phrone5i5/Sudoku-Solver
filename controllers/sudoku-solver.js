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
    const rowNumber = (rowLetter) => {
      const rowPairs = [ ['A', 0], ['B', 1], ['C', 2], ['D', 3], ['E', 4], ['F', 5], ['G', 6], ['H', 7], ['I', 8] ];
      return rowPairs.filter(pair => pair[0] == rowLetter)[0][1];
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
    return columns[column][rowNumber(row)] == '.' && !columns[column].includes(value) ? true : false;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let regions = {
      topLeft: '',
      topCenter: '',
      topRight: '',
      middleLeft: '',
      middleCenter: '',
      middleRight: '',
      bottomLeft: '',
      bottomCenter: '',
      bottomRight: ''
    };
  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

