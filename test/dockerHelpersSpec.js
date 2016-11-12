var expect = require('chai').expect;
var docker = require('../utils/dockerAPI.js');

describe('Docker', function() {

  describe('should create an image', function() {

  });
  
  before(function() {
    // 
  });

  xit('should show all images', function() {

  });

  it('should start container', function() {
    docker.startContainer('szhou/test', 'test1', 'bash', function(err, res) {
      console.log(res);
    });
  });

  xit('should install a package', function() {
    
  });

  xit('it should write to a file', function() {

  });

  xit('it should write to a file with quotations in code input', function() {

  });
});
