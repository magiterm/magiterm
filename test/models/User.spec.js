import { expect } from 'chai';
import Sequelize from 'sequelize';
import User from '../../models/User.js';

describe('Users table', function() {

  before(function(done) {
    User.find({username: 'steve'})
      .then(function(user) {
        if (user) {
          return user.destroy();
        }
        return;
      })
      .then(function() {
        done();
      });
  });
  
  it('should have a new user when user is added', function(done) {
    User.create({ username: 'steve', password: 'stevespassword'})
      .then(function(user) {
        // console.log(user);
        expect(user).to.not.be.null;
        expect(user.dataValues.username).to.equal('steve');
        expect(user.dataValues.password).to.equal('stevespassword');
        done();
      });
  });

  it('should update a user', function(done) {
    User.updateOrCreate({ username: 'steve', password: 'newpassword'}, function(err, user) {
      expect(user).to.not.be.null;
      expect(user.username).to.equal('steve');
      expect(user.password).to.equal('newpassword');
      done();
    });

  });

  it('should not contain a user after user is removed', function(done) {
    // console.log(User.updateOrCreate);

    User.find({ username: 'steve', password: 'newpassword'})
      .then(function(user) {
        return user.destroy();
      }).then(function(user) {
        // console.log(user);
        expect(user).to.not.be.null;
        expect(user.dataValues.username).to.equal('steve');
        expect(user.dataValues.password).to.equal('newpassword');
        done();
      });

    // done();
  });
});