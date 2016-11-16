const exec = require('child_process').exec;

const dockex = "docker exec -i"
const build = "docker build -t"
const run = "docker run -t -d --name"

// const dockex = "docker exec";
// const build = "docker build";
// const run = "docker run";


const runCommand = function(containerName, command, callback) {
  runCommandCommand = dockex + ' ' + containerName + ' ' + command;
  exec(runCommandCommand, function(err, stdout, stderr) {
    if (stderr && !stdout) {
      callback(stderr, null);
    } else {
      callback(null, stdout);
    }
  });
}

const buildImage = function(dockerfile, command, callback) {

}

//** options is containername
const startContainer = function(imageName, containerName, command, callback) {
  const startContainerCommand = run + ' ' + containerName + ' ' + imageName + ' ' + command;
  console.log(startContainerCommand);

  exec(startContainerCommand, function(err, stdout, stderr) {
    console.log('executed start container command');
    if (stderr) {
      callback(stderr, null);
    } else {
      callback(null, stdout);
    }
  })
} 

const destroyContainer = function(containerName, command, callback) {

}

const install = function(installName, containerName, callback) {
  const installCommand = dockex + ' ' + containerName + ' apt-get install -y ' + installName;
  console.log(installCommand);
  exec(installCommand, function(err, stdout, stderr) {
    if (stderr) {
      callback(stderr, null);
    } else {
      callback(null, stdout);
    }
  });
}

const writeToFile = function(containerName, codeInput, callback) {
  const code = JSON.stringify(codeInput).replace("'", "'\\''");
  const echo = "'echo -e ";
  const file = " > juice.js'";
  const command = ' bash -c ' + echo + code + file;
  const fullCommand = dockex + ' ' + containerName + ' ' + command;
  console.log(fullCommand);

  exec(fullCommand, function(err, stdout, stderr) {
    if (stderr) {
      callback(stderr, null);
    } else {
      callback(null, stdout);
    }
  });
}

const directoryExists = function(containerName, directory, callback) {
  const command = '[ -d ' + directory + ' ] && echo "Directory exists"';
  const fullCommand = dockex + ' ' + containerName + ' ' + command;
  exec(fullCommand, function(err, stdout, stderr) {
    callback(stdout);
  });
}

module.exports = {
  runCommand: runCommand,
  startContainer: startContainer,
  install: install,
  writeToFile: writeToFile,
  directoryExists: directoryExists
};


// const writeFile = function(text, filename, callback) {
//   const command = 'bash -c "echo \"console.log(\"text\")\" >> bea.js"'
//}



//command log
// createContainer: 'docker run -t -d --name <name> picoShell/base /bin/bash'
// createFile: 'docker exec -i <name> <file>'
// ls: 'docker exec -i <name> ls'
// buildImage: 'docker build -t picoShell/base'
// install: 'docker exec -i <name> apt-get install -y "what to install"'
//write to file: docker exec "<name>" bash -c "echo '<text>' >> <filename>"
//read a file: docker exec bea cat <filename>