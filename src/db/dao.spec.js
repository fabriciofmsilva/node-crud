const expect = require('chai').expect;

const AppDAO = require('./dao');

describe('AppDAO', function() {
  it('should initialize dao with success', function() {
    const dao = new AppDAO('./database.sqlite3');

    expect(dao).to.be.instanceOf(AppDAO);
  });
});
