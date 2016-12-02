module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      libjs: {
        src: [
        'public/javascripts/jquery-3.1.1.js', 
        'public/javascripts/jquery-ui.js', 
        'public/javascripts/bootstrap/bootstrap.js',
        'public/codemirror/lib/codemirror.js',
        'public/codemirror/mode/python/python.js',
        'public/codemirror/mode/javascript/javascript.js',
        'public/codemirror/mode/ruby/ruby.js',
        'public/codemirror/mode/xml/xml.js',
        'public/codemirror/mode/jsx/jsx.js',
        'public/codemirror/mode/css/css.js',
        'public/codemirror/mode/markdown/markdown.js',
        'public/codemirror/mode/gfm/gfm.js',
        'public/codemirror/mode/htmlembedded/htmlembedded.js',
        'public/codemirror/addon/selection/active-line.js',
        'public/codemirror/addon/mode/multiplex.js',
        'public/codemirror/addon/edit/closebrackets.js',
        'public/codemirror/addon/edit/continuelist.js',
        'public/codemirror/addon/mode/overlay.js',
        'public/codemirror/addon/scroll/simplescrollbars.js',
        ],
        dest: 'public/dist/lib/javascriptsbuild.js'
      }
    },

    clean: ['public/dist/lib/*.js'],

    uglify: {
      my_target: {
        files: {
          'public/dist/lib/javascriptsbuild.min.js': ['public/dist/lib/javascriptsbuild.js'],
        }
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'public/dist/main.css': [
          'public/stylesheets/imports.css',
          'public/stylesheets/bootstrap.css',
          'public/stylesheets/slick.css',
          'public/stylesheets/slick-theme.css',
          'public/stylesheets/flexboxgrid.css',
          'public/stylesheets/style.css',
          'public/codemirror/theme/monokai.css',
          'public/codemirror/addon/scroll/simplescrollbars.css',
          'public/stylesheets/ionicons.css'

          ]
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'node', 'start' ]);
  });

  grunt.registerTask('build', [
    'clean',
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('deploy', function(n) {
    // add your deploy tasks here
    if (grunt.option('prod')) {
      grunt.task.run([
        'build',
        'server-dev'
      ]);
    } else {
      grunt.task.run([
        'build',
        'server-dev'
      ]);
    }
  });


};
