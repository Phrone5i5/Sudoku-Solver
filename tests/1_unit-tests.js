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
            assert.equal(solver.validate(demoPuzzles[0][0]), true, 'validation should return true for 81 character string');
            done();
        });

        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
            assert.equal(solver.validate(invalidPuzzles.invalidChars), false, 'validation should return false for 81 character string with invalid characters');
            done();
        });

        test('Logic handles an invalid puzzle string that is < 81 characters', (done) => {
            assert.equal(solver.validate(invalidPuzzles.invalidLength), false, 'validation should return false for character string with a length less than 81');
            done();
        });

    });

    suite('Row placement validation', () => {



    });

    suite('Column placement validation', () => {



    });

    suite('Grid placement validation', () => {



    });

    suite('Solver conclusions validation', () => {



    });

});
