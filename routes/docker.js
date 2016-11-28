'use strict';
var express = require('express');
var router = express.Router();
const docker = require('../utils/dockerAPI');
var db = require('../db/config');
var User = require('../models/User');


router.post('/executeFile', function(req,res) {
  var fileName = req.body.fileName;
  var fileType = fileName.slice(fileName.lastIndexOf('.'));
  if(fileType === '.js') {
    var code = req.body.code;
    var newCode = code.replace(/\n/g, '\\n');
    newCode = newCode.replace(/\"/g, '\\\"');
    newCode = newCode.replace(/'/g, "\\\"");
    var command = 'bash -c "echo -e \'' + newCode + '\' > ' + req.body.filePath + '/' + fileName + '"'
    
    docker.runCommand(req.body.containerName, command, function(err, response) {
      if(err) {
        res.status(500).send(err);
      } else {
        docker.runCommand(req.body.containerName, 'node ' + req.body.filePath + '/' + fileName, function(err1, response1) {
          if(err1) {
            res.status(500).send(err);
          } else {
            console.log('this is the file', response1);
            res.status(200).send({res: response1, cmd: 'node'});
          }
        });
      }
    });
  } else if (fileType === '.rb') {
    var code = req.body.code;
    var newCode = code.replace(/\n/g, '\\n');
    newCode = newCode.replace(/\"/g, '\\\"');
    newCode = newCode.replace(/'/g, "\\\"");
    var command = 'bash -c "echo -e \'' + newCode + '\' > ' + req.body.filePath + '/' + fileName + '"'
    docker.runCommand(req.body.containerName, command, function(err, response) {
      if(err) {
        res.status(500).send(err);
      } else {
        docker.runCommand(req.body.containerName, 'ruby ' + req.body.filePath + '/' + fileName, function(err1, response1) {
          if(err1) {
            res.status(500).send(err);
          } else {
            res.status(200).send({res: response1, cmd: 'ruby'});
          }
        });
      }
    });
  } else if (fileType === '.py') {
    var code = req.body.code;
    var newCode = code.replace(/\n/g, '\\n');
    newCode = newCode.replace(/\"/g, '\\\"');
    newCode = newCode.replace(/'/g, "\\\"");
    var command = 'bash -c "echo -e \'' + newCode + '\' > ' + req.body.filePath + '/' + fileName + '"'
    docker.runCommand(req.body.containerName, command, function(err, response) {
      if(err) {
        res.status(500).send(err);
      } else {
        docker.runCommand(req.body.containerName, 'python ' + req.body.filePath + '/' + fileName, function(err1, response1) {
          if(err1) {
            res.status(500).send(err);
          } else {
            res.status(200).send({res: response1, cmd: 'python'});
          }
        });
      }
    });
  } else {
    res.status(500).send({msg: "Cannot execute filetype '" + fileType + "'"});
  }
});

router.post('/handleFileBrowserChange', function(req, res) {
  var dir;
  if(req.body.dir.endsWith('/')) {
    dir = req.body.dir + req.body.entry;
  } else {
    dir = req.body.dir + '/' + req.body.entry;
  }
  //const dir = req.body.dir + '/' + req.body.entry
  docker.directoryExists(req.body.containerName, dir, function(dirExists) {
    if(dirExists.indexOf('Directory exists') !== -1) {
      res.status(200).send({type: 'dir', newDir: req.body.entry});
    } else {
      docker.runCommand(req.body.containerName, 'cat ' + dir, function(err, response) {
        if(err) {
          res.status(500).send(err);
        } else {
          res.status(200).send({type: 'file', fileContents: response});
        }
      })
    }
  });
});

router.post('/handleCodeSave', function (req, res) {
  /*
  const fileName = req.body.fileName;
  const containerName = req.body.containerName;
  const code = JSON.stringify(req.body.codeValue).replace(/'/g, "\\\"");
  const echo = "'echo -e ";
  const file = " > " + fileName + "'"
  const command = 'bash -c ' + echo + code + file;
  */
  //Refactor handleCodeSave to work on Windows. If it doesn't work on Mac, you can change it back to the above.
  console.log('IN HANDLE SAVE');
  var containerName = req.body.containerName;
  var code = req.body.codeValue;
  var newCode = code.replace(/\n/g, '\\n');
  newCode = newCode.replace(/\"/g, '\\\"');
  newCode = newCode.replace(/'/g, "\\\"");
  var command = 'bash -c "echo -e \'' + newCode + '\' > ' + req.body.filePath + '/' + req.body.fileName + '"'
  console.log('SAVE_CMD', command);
  docker.runCommand(containerName, command, function(err, response) {
    if (err) {
      console.log('ERR', err);
      res.status(500).send(err);
    } else {
      console.log('RESP', response);
      res.status(200).send(response);
    }
  });
});


router.post('/cmd', function (req, res) {
  var cmd = req.body.cmd;
  var containerName = req.body.containerName;

  if(cmd.split(" ")[0] === 'cd') {
    let newdir = cmd.split(" ")[1];
    console.log('change dir to: ', newdir);
    let readyToExecute = true;
    if(newdir === '..') {
      readyToExecute = false;
      docker.runCommand(containerName, 'cat /picoShell/.pico', function(err, picoRes) {
        if(picoRes[picoRes.length - 1] === '\n') picoRes = picoRes.slice(0, picoRes.length - 1);
        newdir = picoRes;
        if(newdir.indexOf('/') !== newdir.lastIndexOf('/')) {
          newdir = newdir.slice(0, newdir.lastIndexOf('/'));
        } else {
          newdir = '/';
        }

        const command = 'bash -c "echo ' + newdir + ' > /picoShell/.pico' + '"'; 
        docker.runCommand(containerName, command, function(err, res1) {
          if (err) { res.status(200).send(err); } 
          else { 
            res.status(200).send({res: res1, pwd: newdir}); 
          }
        });
      });
    } else if (newdir[0] !== '/') {
      //append newdir to current dir
      readyToExecute = false;
      docker.runCommand(containerName, 'cat /picoShell/.pico', function(err, picoRes) {
        if(picoRes[picoRes.length - 1] === '\n') picoRes = picoRes.slice(0, picoRes.length - 1);
        if(picoRes[picoRes.length - 1] === '/') picoRes = picoRes.slice(0, picoRes.length - 1);
        const dir = picoRes + '/' + newdir;
        docker.directoryExists(containerName, dir, function(dirRes) {
          if(dirRes.indexOf('Directory exists') !== -1) {
            const command = 'bash -c "echo ' + dir + ' > /picoShell/.pico' + '"'; 
            //const command = 'bash -c "cd ' + newdir + '"';
            console.log(command);
            docker.runCommand(containerName, command, function(err, res1) {
              if (err) { res.status(200).send(err); } 
              else { 
                res.status(200).send({res: res1, pwd: dir}); 
              }
            });
          } else {
            res.status(200).send('Error: Directory not found\n');
          }
        });
      });
    }
    if(readyToExecute) {
      const command = 'bash -c "echo ' + newdir + ' > /picoShell/.pico' + '"';
      console.log(command);
      docker.directoryExists(containerName, newdir, function(dirRes) {
        if(dirRes.indexOf('Directory exists') !== -1) {
          docker.runCommand(containerName, command, function(err, res1) {
            if (err) { res.status(200).send(err); } 
            else { 
              docker.runCommand(containerName, 'cat /picoShell/.pico', function(err2, res2) {
                res.status(200).send({res: res1, pwd: res2}); 
              });
            }
          });
        } else {
          res.status(200).send('Error: Directory not found\n');
        }
      });
    }
  } else if(cmd.split(" ")[0] === 'open') {
    console.log('this is the command', cmd);
    docker.runCommand(containerName, 'cat /picoShell/.pico', function(err1, res1) {
      if(res1[res1.length - 1] === '\n') res1 = res1.slice(0, res1.length - 1);
      const command = 'cat ' + res1 + '/' + cmd.split(" ")[1];
      docker.runCommand(containerName, command, function(err2, res2) {
        if(err2) {
          res.status(200).send(err2);
        } else {
          res.status(200).send({termResponse: res2, fileOpen: true, fileName: cmd.split(" ")[1], filePath: res1});
        }
      });
    });
  } else if (cmd.split(" ")[0] === 'pico') {
    var fileName = cmd.split(" ")[1];
    if(fileName.startsWith('/')) {
      docker.runCommand(containerName, 'touch ' + fileName, function(err1, res1) {
        if(err1) {
          res.status(500).send(err1);
        } else {
          var filePath = fileName.slice(0, fileName.lastIndexOf('/'));
          fileName = fileName.slice(fileName.lastIndexOf('/') + 1);
          res.status(200).send({newFile: true, res: res1, fileName: fileName, filePath: filePath})
        }
      });
    } else {
      docker.runCommand(containerName, 'cat /picoShell/.pico', function(err1, res1) {
        if(res1[res1.length - 1] === '\n') res1 = res1.slice(0, res1.length - 1);
        if(res1[res1.length - 1] === '/') res1 = res1.slice(0, res1.length - 1);
        const command = 'touch ' + res1 + '/' + fileName;
        docker.runCommand(containerName, command, function(err2, res2) {
          if(err2) {
            res.status(500).send(err2);
          } else {
            res.status(200).send({termResponse: res2, fileName: fileName, filePath: res1, fileOpen: true});
          }
        });
      });
    }
  } else if (cmd.split(" ")[0] === 'download') {
    console.log('IN DOWNLOAD');
    var fileName = cmd.split(" ")[1];
    if(fileName.startsWith('/')) {
      const command = 'cat ' + fileName;
      docker.runCommand(containerName, command, function(err2, res2) {
        if(err2) {
          res.status(200).send(err2);
        } else {
          res.status(200).send({download: true, fileContents: res2, fileName: fileName});
        }
      });
    } else {
      docker.runCommand(containerName, 'cat /picoShell/.pico', function(err1, res1) {
        if(res1[res1.length - 1] === '\n') res1 = res1.slice(0, res1.length - 1);
        const command = 'cat ' + res1 + '/' + fileName;
        docker.runCommand(containerName, command, function(err2, res2) {
          if(err2) {
            res.status(200).send(err2);
          } else {
            res.status(200).send({download: true, fileContents: res2, fileName: fileName});
          }
        });
      });
    }
  } else {
    docker.runCommand(containerName, 'cat /picoShell/.pico', function(err1, res1) {
      console.log('response from cat /picoShell/.pico :', res1);
      console.log('this is the container name', containerName);

      if (err1) {
        res.status(404).send('Creating .pico');
      } else {
        res1 = res1.replace(/^\s+|\s+$/g, '');

        cmd = '"cd ' + res1 + ' && ' + cmd + '"';
        const command = 'bash -c ' + cmd;
        console.log(command);
        docker.runCommand(containerName, command, function(err2, res2) {
          if (err2) { res.status(200).send(err2); } 
          else { res.status(200).send(res2); }
        });
      }

    }) 
  }
});


module.exports = router;