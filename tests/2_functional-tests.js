const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const invalidPuzzles = {
    invalidChars: '.-1--11..11..--- ... .-..--- 1.1.11--.-.1- .-11.--1 .---... -11-1.---  1  1-..--1',
    invalidLength: '..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
}

suite('Functional Tests', () => {

    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
            })
            .end((err, res) => {
                if (err) {
                  assert.fail();
                }
                let resObj = res.body;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(resObj.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378',
                 'Submitting a valid puzzle string should return a correctly solved puzzle string');
                done();
            });
    });
    
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: ''
            })
            .end((err, res) => {
                if (err) {
                  assert.fail();
                }
                let resObj = res.body;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(resObj.error, 'Required field missing',
                 'Submitting an empty puzzle string should return an error');
                done();
            });
    });

    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: invalidPuzzles[0]
            })
            .end((err, res) => {
                if (err) {
                  assert.fail();
                }
                let resObj = res.body;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(resObj.error, 'Invalid characters in puzzle',
                 'Submitting a puzzle string with invalid characters should return an error');
                done();
            });
    });

    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: invalidPuzzles[1]
            })
            .end((err, res) => {
                if (err) {
                  assert.fail();
                }
                let resObj = res.body;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(resObj.error, 'Expected puzzle to be 81 characters long',
                 'Submitting a puzzle string of invalid length should return an error');
                done();
            });
    });

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
            })
            .end((err, res) => {
                if (err) {
                  assert.fail();
                }
                let resObj = res.body;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(resObj.error, 'Puzzle cannot be solved',
                 'Submitting an unsolvable puzzle should return an error');
                done();
            });
    });

    test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'A2',
                value: '3'
            })
            .end((err, res) => {
                if (err) {
                  assert.fail();
                }
                let resObj = res.body;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(resObj.valid, true, 'Valid placement should return true');
                done();
            });
    });

    test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'B2',
                value: '3'
            })
            .end((err, res) => {
                if (err) {
                  assert.fail();
                }
                let resObj = res.body;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(resObj.valid, false, 'Invalid placement should return false');
                assert.equal(resObj.conflict, ['row'], 'Invalid placement should return the conflicting area');
                done();
            });
    });

    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'B1',
                value: '3'
            })
            .end((err, res) => {
                if (err) {
                  assert.fail();
                }
                let resObj = res.body;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(resObj.valid, false, 'Invalid placement should return false');
                assert.equal(resObj.conflict, ['row', 'column'], 'Invalid placement should return the conflicting areas');
                done();
            });
    });

    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'A2',
                value: '2'
            })
            .end((err, res) => {
                if (err) {
                  assert.fail();
                }
                let resObj = res.body;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(resObj.valid, false, 'Invalid placement should return false');
                assert.equal(resObj.conflict, ['row', 'column', 'region'], 'Invalid placement should return the conflicting areas');
                done();
            });
    });

    test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'A2',
                value: '2'
            })
            .end((err, res) => {
                if (err) {
                  assert.fail();
                }
                let resObj = res.body;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(resObj.error, 'Required field(s) missing', 'Mising fields should return an error');
                done();
            });
    });

    test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'A2',
                value: '2'
            })
            .end((err, res) => {
                if (err) {
                  assert.fail();
                }
                let resObj = res.body;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(resObj.error, 'Invalid value', 'Invalid characters should return an error');
                done();
            });
    });

    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'A2',
                value: '2'
            })
            .end((err, res) => {
                if (err) {
                  assert.fail();
                }
                let resObj = res.body;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(resObj.error, 'Expected puzzle to be 81 characters long', 'Invalid puzzle length should return an error');
                done();
            });
    });

    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'A2',
                value: '2'
            })
            .end((err, res) => {
                if (err) {
                  assert.fail();
                }
                let resObj = res.body;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(resObj.error, 'Invalid coordinate', 'Invalid coordinates should return an error');
                done();
            });
    });

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'A2',
                value: '2'
            })
            .end((err, res) => {
                if (err) {
                  assert.fail();
                }
                let resObj = res.body;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(resObj.error, 'Invalid value', 'Checking an invalid placement value should return an error');
                done();
            });
    });

});

