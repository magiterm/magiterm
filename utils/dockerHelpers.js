const Docker = require('dockerode');
// var tar = require('tar-fs');
const docker = new Docker();

const listImages = function(options, callback) {
  docker.listImages(function(err, images) {
    callback(images);
  });
};

// Lists all containers in this docker machine
const listContainers = function(options, callback) {
  options = options || {all: true}; // default to all

  docker.listContainers(options, function(err, containers) {
    callback(containers);
  });
};

const buildImage = function(dockerfile, options, callback) {
  // docker.buildImage('./Dockerfile.tar', {t: 'szhou/test'}, function(err, stream) {
  docker.buildImage(dockerfile, options, function(err, stream) {
    if(err) { callback(err); }

    stream.pipe(process.stdout, {end: true});

    stream.on('end', function() {
      console.log('finished building');
      callback();
    });
  });
}

//options should be {Name: username}
const createContainer = function(image, options, callback) {
  docker.run(image, ['-t', '-d', '/bin/bash'], [process.stdout, process.stderr], function(err, data, container) {
    console.log(data);
  });
}

// container.inspect(function(err, data) {
//   console.log(data);
// });

// container.start(function(err, data) {
//   console.log(data);
// });

module.exports = {
  listImages: listImages,
  listContainers: listContainers,
  buildImage: buildImage
};