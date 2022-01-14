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
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 2, 6),
                true,
                'row placement with valid string, row, column and value should return true');
            done();
        });

        test('Logic handles an invalid row placement', (done) => {
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 1, 6),
                false,
                'row placement with conflicting coordinate should return false');
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 3, 6),
                false,
                'row placement with conflicting coordinate should return false');
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 3, 1),
                false,
                'placement in row with existing number the same as value should return false');
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'B', 3, 2),
                false,
                'placement in row with existing number the same as value should return false');
            done();
        });

    });

    suite('Column placement validation', () => {

        test('Logic handles a valid column placement', (done) => {
            assert.equal(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'B', 1, 6),
                true,
                'column placement with valid string, coordinate and value should return true');
            assert.equal(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'E', 2, 4),
                true,
                'column placement with valid string, coordinate and value should return true');
            done();
        });

        test('Logic handles an invalid column placement', (done) => {
            assert.equal(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 3, 4),
                false,
                'column placement with conflicting coordinate should return false');
            assert.equal(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 1, 8),
                false,
                'column placement with conflicting value should return false');
            done();
        });

    });

    suite('Grid placement validation', () => {
        // write the unit test, make it fail, (you'll still get to see the useful console.log), and then go back to finish the function
        test('Logic handles a valid region (3x3 grid) placement', (done) => {
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'A', 2, 4).valid,
                true,
                'region placement with valid co-ordinate and non-conflicting value should pass');
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'D', 3, 4).valid,
                true,
                'region placement with valid co-ordinate and non-conflicting value should pass');
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'H', 2, 5).valid,
                true,
                'region placement with valid co-ordinate and non-conflicting value should pass')
            done();
        });

        test('Logic handles an invalid region (3x3 grid) placement', (done) => {
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'C', 2, 3).valid,
                false,
                'region placement with valid co-ordinate and non-conflicting value should pass');
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 'H', 9, 4).valid,
                false,
                'region placement with valid co-ordinate and non-conflicting value should pass');
            done();
        });

    });

    suite('Solver conclusions validation', () => {

        test('Valid puzzle strings pass the solver', (done) => {
            assert.equal(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.').solution,
                '135762984946381257728459613694517832812936745357824196473298561581673429269145378',
                'a string with 81 valid characters including required blanks should pass the solver');
            assert.equal(solver.solve('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3').solution,
                '568913724342687519197254386685479231219538467734162895926345178473891652851726943',
                'a string with 81 valid characters including required blanks should pass the solver');
            done();
        });
        
        test('Invalid puzzle strings fail the solver', (done) => {
            assert.equal(solver.solve(invalidPuzzles.invalidLength).valid, false, 'invalid puzzle string of less than 81 characters should fail');
            assert.equal(solver.solve(invalidPuzzles.invalidChars).valid, false, 'puzzle string with invalid chars should fail');
            done();
        });

        test('Solver returns the expected solution for an incomplete puzzle', (done) => {
            assert.equal(solver.solve('..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1').solution,
                '218396745753284196496157832531672984649831257827549613962415378185763429374928561',
                'valid incomplete puzzle string should return a valid solution');
            assert.equal(solver.solve('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6').solution,
                '473891265851726394926345817568913472342687951197254638734162589685479123219538746',
                'valid incomplete puzzle string should return a valid solution');
            done();
        });

    });

});
