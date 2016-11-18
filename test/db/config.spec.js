import { expect } from 'chai';
import Sequelize from 'sequelize';
import dbConfig from '../../db/config.js';

describe("mySQL database", function() {

  it('should connect with valid credentials', function(done){

    dbConfig.authenticate().then(function(err) {
      expect(err).to.be.undefined;
      done();
    });
  });

  it('should NOT connect with invalid credentials', function(done){
    
    const db = new Sequelize('picodb', 'root', 'wrongpassword', {
      host: 'localhost',
      dialect: 'mysql',

      pool: { max: 5, min: 0, idle: 1000 }
    });

    db.authenticate().catch(function(err) {
      expect(err).to.not.be.undefined;
      done();
    });
  });

});
