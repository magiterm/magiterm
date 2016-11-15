var expect = require('chai').expect;
var docker = require('../../utils/dockerAPI.js');

describe('Docker', function() {

  describe('should create an image', function() {

  });
  
  before(function() {
    // 
  });

  xit('should show all images', function() {

  });

  it('should start container', function() {
    console.log('start')

    var res = 'test';

    docker.startContainer('szhou/test2', 'juice1', 'bash', function(err, res) {
      console.log('res', res);
      res = res;
      expect(err).to.be.null;
      expect(res).to.not.be.null;
      expect(1).to.be(0);
    });
    console.log('done')
    console.log(res)
    expect(res).to.not.be.null;
  });

  it('should ls /picoShell directory', function() {
    var console = this.console;
    docker.runCommand('juice', 'bash -c "cd /picoShell && ls"', function(err, res) {
      console.log(err, res);
    })
  });


  xit('should install a package', function() {
    
  });

  xit('it should write to a file', function() {

  });

  xit('it should write to a file with quotations in code input', function() {

  });
});