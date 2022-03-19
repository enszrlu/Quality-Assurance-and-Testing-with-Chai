const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.text, 'hello Guest', 'Response should be "hello John"');
          done();
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .get('/hello?name=xy_z')
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.text, 'hello xy_z', 'Response should be "hello xy_z"');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .put('/travellers')
        .send({
          "surname": "Colombo"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.type, "application/json", "Response type should be 'application/json'");
          assert.equal(res.body.name, "Cristoforo", "Response body.name should be 'Cristoforo'");
          assert.equal(res.body.surname, "Colombo", "Response body.surname should be 'Colombo'")
          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai.request(server).put('/travellers').send({ surname: "da Verrazzano" })
        .end((err, res) => {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.type, "application/json", "Response type should be 'application/json'");
          assert.equal(res.body.name, "Giovanni", "Response body.name should be 'Giovanni'");
          assert.equal(res.body.surname, "da Verrazzano", "Response body.surname should be 'da Verrazzano'")

          done();
        })
    });
  });
});

const Browser = require('zombie');
Browser.site = 'http://localhost:3000/';


suite('Functional Tests with Zombie.js', function () {
  this.timeout(5000);

  const browser = new Browser();

  suiteSetup(function (done) {
    return browser.visit('/', done);
  });

  suite('Headless browser', function () {
    test('should have a working "site" property', function () {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    test('Submit the surname "Colombo" in the HTML form', function (done) {
      browser.fill('surname', "Colombo").then(() => {
        browser.pressButton('submit', () => {
          browser.assert.success('Response status should be 200 after button press');
          browser.assert.text('span#name', "Cristoforo", "Name text should be 'Cristoforo'");
          browser.assert.text('span#surname', "Colombo", "Name text should be 'Colombo'");
          browser.assert.elements('span#dates', 1, "There should be 1 #dates element");

          done();
        })
      })
    });
    // #6
    test('Submit the surname "Vespucci" in the HTML form', function (done) {
      browser.fill('surname', "Vespucci").then(() => {
        browser.pressButton('submit', () => {
          browser.assert.success('Response status should be 200 after button press');
          browser.assert.text('span#name', "Amerigo", "Name text should be 'Amerigo'");
          browser.assert.text('span#surname', "Vespucci", "Name text should be 'Vespucci'");
          browser.assert.elements('span#dates', 1, "There should be 1 #dates element");

          done();
        })
      })
    });
  });
});
