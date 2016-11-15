import { expect } from 'chai';
import Sequelize from 'sequelize';
import User from '../../models/User.js';

describe('Users table', function() {
  
  it('should have a new user when user is added', function(done) {
    User.create({ username: 'steve', password: 'stevespassword'})
      .then(function(user) {
        // console.log(user);
        expect(user).to.not.be.null;
        expect(user.dataValues.username).to.equal('steve');
        expect(user.dataValues.password).to.equal('stevespassword');
        done();
      })
  });

  xit('should not contain a user after user is removed', function(done) {

  })
});