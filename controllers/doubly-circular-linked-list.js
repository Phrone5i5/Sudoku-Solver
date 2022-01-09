const { json } = require("body-parser");

class HeaderNode {
  constructor(data) {
    this.data = data;
    // Unique ID for each column header.
    this.columnID = data.columnID ? data.columnID : null;
    // A count of all nodes under the column, for general checking.
    this.nodeCount = null;
    // head and tail for rows
    this.headRow = null; // changed from null to this
    this.tailRow = this; // changed from null to this
    /* Directional Links */
    this.left = null;
    this.right = null;
    this.up = this.tailRow;
    this.down = this.headRow;
  }

  appendRow(data) {
    let newRow = new Node(data);
    // Instead of using a while loop to iterate until finding the last down before the currCol,
    // set up headRow and tailRow keys for the headerNodes, so that we can easily jump to the start or the end,
    // allowing us to append rows as easily as columns are.
    if (!this.headRow) {
      this.headRow = newRow;
      this.tailRow = newRow;
      this.up = this.tailRow;
      this.down = this.headRow;
    } else {
      newRow.up = this.tailRow;
      this.tailRow.down = newRow;
      this.tailRow = newRow;
      this.up = this.tailRow;
      this.down = this.headRow;
    }
      this.headRow.up = this;
      this.tailRow.down = this;
      this.nodeCount += 1;
  }

  forEachRow(callback) {
    let current = this.headRow;
    while (current && current != this) {
      callback(current);
      current = current.down;
    }
  }
}

class Node {
  constructor(data) {
    // The data object containing the rowID, header, value, and any other key information for regular nodes;
    // for header nodes it contains the columnID.
    this.data = data;    
    // The key to represent which column a row node belongs to.
    this.header = data.header ? data.header : null;
    // The ID to represent which row a node falls under, allowing exact precision by using both header and rowID to isolate a node.
    this.rowID = data.rowID ? data.rowID : null;
    // The key to represent which region a node falls under, so that that new values can be checked for validiity against the already existing values in the region.
    this.region = data.region ? data.region : null;
    // The value holding the number of blank representing character.
    this.value = data.value ? data.value : null;
    // Whether or not the space is originally a blank, ergo mutable.
    this.mutable = data.value == '.' ? true : false;
    /* Directional Links */
    this.left = null;
    this.right = null;
    this.up = null;
    this.down = null;
  }
}
  
class DoublyLinkedList {
  constructor(data) {
    this._head = new HeaderNode(data);
    this._tail = this._head;
    this._head.left = this._head.right = this._head;
  }

  getColById(colID) {
    let currCol = this._head.right;
    while (currCol != this._head) {
      if (currCol.columnID == colID) {
        return currCol;
      } else {
        currCol = currCol.right;
      }
    }
  }

  // Insert column header node at the end of the list
  appendColumn(data) {
    let newTail = new HeaderNode(data);
    newTail.left = this._tail;
    newTail.left.right = newTail;
    this._tail = newTail;
    this._head.left = this._tail;
    this._tail.right = this._head;
    this._head.nodeCount += 1;
    return this;
  }

  printList() {
    let rows = { A: '', B: '', C: '', D: '', E: '', F: '', G: '', H: '', I: '' };
    this.forEachColumn(column => {
      this.forEachRow(column, row => {
        rows[row.rowID] += row.data.value;
      });
    });
    return console.log(rows);
  }

  forEachColumn(callback) {
    let current = this._head.right;
    while (current && current != this._head) {
      callback(current);
      current = current.right;
    }
  }

  getHead() {
    return this._head;
  }

  createSudokuMatrix(puzzleString) {
    // Array of row letters to assign
    const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    // Object to hold the column strings
    let columns = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '' };
    // Populating the columns object with the current values of each column
    let columnKeys = Object.keys(columns);
    columnKeys.forEach((key, outerIndex) => {
      let currentColumn = '';
      for (let innerIndex in columnKeys) {
        currentColumn = currentColumn.concat(puzzleString[innerIndex * 9 + outerIndex]);
      }
      columns[outerIndex + 1] = currentColumn;
    });

    // Create a regions object and check to see which region a node falls under
    const checkRegion = (row, col) => {
      let result;
      const regions = {
        topLeft: { rows: ['A', 'B', 'C'], columns: [1, 2, 3] },
        topCenter: { rows: ['A', 'B', 'C'], columns: [4, 5, 6] },
        topRight: { rows: ['A', 'B', 'C'], columns: [7, 8, 9] },
        middleLeft: { rows: ['D', 'E', 'F'], columns: [1, 2, 3] },
        middleCenter: { rows: ['D', 'E', 'F'], columns: [4, 5, 6] },
        middleRight: { rows: ['D', 'E', 'F'], columns: [7, 8, 9] },
        bottomLeft: { rows: ['G', 'H', 'I'], columns: [1, 2, 3] },
        bottomCenter: { rows: ['G', 'H', 'I'], columns: [4, 5, 6] },
        bottomRight: { rows: ['G', 'H', 'I'], columns: [7, 8, 9] },
      };
      const regionKeys = Object.keys(regions);
      regionKeys.forEach(key => {
        if (regions[key].rows.includes(row) && regions[key].columns.includes(col)) {
          result = key;
        }
      });
      return result;
    }

    // Initialize the 9 columns needed for a standard Sudoku board
    let currCol = this.getHead().right;
    for (let c = 0; c < 9; c++) {
      this.appendColumn({ columnID: c + 1 });
      // Add 9 rows to each column, bring our data structure to: 1 head, 9 column headers, 81 Sudoku square nodes.
      for (let r = 0; r < 9; r++) {
        this.getColById(c + 1).appendRow({
          header: c + 1,
          rowID: rowLetters[r],
          region: checkRegion(rowLetters[r], c + 1),
          value: columns[c + 1][r]
        });
      }
    }

    /* For logging the data input to every column and row, and making sure everything runs the correct nubmer of times
    this.forEachColumn(column => {
      console.log(column.data);
      column.forEachRow(row => {
        console.log(row.data);
      });
    });
    */
    
    // Connect all of the rows generated under the columns to each other with left and right pointers
    this.forEachColumn(column => {
      let leftCol = column.left.data == 'head' ? column.left.left : column.left;
      let rightCol = column.right.data == 'head' ? column.right.right : column.right;
      column.forEachRow(row => {
        let rowLeft = leftCol.down;
        let rowRight = rightCol.down;
        while (row.left == null && row.right == null) {
          if (rowLeft.rowID == row.rowID && rowRight.rowID == row.rowID) {
            row.left = rowLeft;
            row.right = rowRight;
            //console.log('row:', row.data, 'L:', row.left.data, 'R:', row.right.data);
          }
          rowLeft = rowLeft.down;
          rowRight = rowRight.down;
        }
      });
    });
    console.log(this.getHead().right.up);
  }

  coverRow() {

  }

  coverCol() {

  }

  uncoverRow() {

  }

  uncoverCol() {
    
  }

}

  module.exports = { 
    Node: Node,
    DoublyLinkedList: DoublyLinkedList
  };