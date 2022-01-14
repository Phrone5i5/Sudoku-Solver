'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const solver = new SudokuSolver();

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let body = req.body;
      // Check if all required fields exist
      if (!body.coordinate || !body.puzzle || !body.value) {
        res.json({ error: 'Required field(s) missing' });
      } else {
        let puzzleString = body.puzzle;
        let value = body.value;
        // Check if value is valid
        if (value < 1 || value > 9 || isNaN(value)) {
          res.json({ error: 'Invalid value' });
        }
        let row = body.coordinate.split('')[0];
        let col = parseInt(body.coordinate.split('')[1]);
        // Check if placement coordinates are valid
        if (solver.getRowNumber(row) == null || col > 9 || col <= 0) {
         res.json({ error: 'Invalid coordinate' });
        }
       // Check if the puzzleString / puzzle content is valid
       if (solver.validate(puzzleString).valid == false) {
        res.json(solver.validate(puzzleString));
       } else {
         // Check for any conflicts
         let conflictArr = [];
         let rowValid = solver.checkRowPlacement(puzzleString, row, col, value);
         let colValid = solver.checkColPlacement(puzzleString, row, col, value);
         let regionValid = solver.checkRegionPlacement(puzzleString, row, col, value).valid;
         if (rowValid == false) {
          conflictArr.push('row'); 
         }
         if (colValid == false)  {
          conflictArr.push('column'); 
         } 
         if (regionValid == false) {
          conflictArr.push('region');
         } 
         if (conflictArr.length) {
          res.json({ valid: false, conflict: conflictArr });
         } else {
           // If there are no conflict, the placement is valid
           res.json({ valid: true });
         }
       }
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let body = req.body;
      let puzzleString = body.puzzle;
      if (!puzzleString) {
        res.json({ error: 'Required field missing' });
      }
      if (solver.validate(puzzleString).valid) {
        res.json(solver.solve(puzzleString));
      } else {
        res.json(solver.validate(puzzleString));
      }
    });
};
