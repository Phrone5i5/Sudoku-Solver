const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();
const demoPuzzles = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;

const invalidPuzzles = {
    invalidChars: '.-1--11..11..--- ... .-..--- 1.1.11--.-.1- .-11.--1 .---... -11-1.---  1  1-..--1',
    invalidLength: '..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
}

suite('UnitTests', () => {

    suite('Input string validation', () => {

        test('Logic handles a valid puzzle string of 81 characters', (done) => {
            assert.equal(solver.validate(demoPuzzles[0][0]).valid, true, 'validation should return true for valid 81 character string');
            done();
        });

        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
            assert.equal(solver.validate(invalidPuzzles.invalidChars).valid, false, 'validation should return false for 81 character string with invalid characters');
            done();
        });

        test('Logic handles an invalid puzzle string that is < 81 characters', (done) => {
            assert.equal(solver.validate(invalidPuzzles.invalidLength).valid, false, 'validation should return false for character string with a length less than 81');
            done();
        });

    });

    suite('Row placement validation', () => {

        test('Logic handles a valid row placement', (done) => {
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 2, 6), true, 'row placement with valid string, row, column and value should return true');
            done();
        });

        test('Logic handles an invalid row placement', (done) => {
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 1, 6), false, 'row placement with conflicting coordinate should return false');
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 3, 6), false, 'row placement with conflicting coordinate should return false');
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 3, 1), false, 'placement in row with existing number the same as value should return false');
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'B', 3, 2), false, 'placement in row with existing number the same as value should return false');
            done();
        });

    });

    suite('Column placement validation', () => {

        test('Logic handles a valid column placement', (done) => {
            assert.equal(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'B', 1, 6), true, 'column placement with valid string, coordinate and value should return true');
            assert.equal(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'E', 2, 4), true, 'column placement with valid string, coordinate and value should return true');
            done();
        });

        test('Logic handles an invalid column placement', (done) => {
            assert.equal(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 3, 4), false, 'column placement with conflicting coordinate should return false');
            assert.equal(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 1, 8), false, 'column placement with conflicting value should return false');
            done();
        });

    });

    suite('Grid placement validation', () => {
        // write the unit test, make it fail, (you'll still get to see the useful console.log), and then go back to finish the function
        test('Logic handles a valid region (3x3 grid) placement', (done) => {
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 2, 4), true, 'region placement with valid co-ordinate and non-conflicting value should pass');
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'D', 3, 4), true, 'region placement with valid co-ordinate and non-conflicting value should pass');
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'H', 2, 5), true, 'region placement with valid co-ordinate and non-conflicting value should pass')
            done();
        });

        test('Logic handles an invalid region (3x3 grid) placement', (done) => {
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'C', 2, 2), false, 'region placement with valid co-ordinate and non-conflicting value should pass');
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'H', 9, 4), false, 'region placement with valid co-ordinate and non-conflicting value should pass');
            done();
        });

    });

    suite('Solver conclusions validation', () => {

        test('Valid puzzle strings pass the solver', (done) => {
            
            done();
        });
        
        test('Invalid puzzle strings fail the solver', (done) => {
            
            done();
        });

        test('Solver returns the expected solution for an incomplete puzzle', (done) => {
            
            done();
        });

    });

});
