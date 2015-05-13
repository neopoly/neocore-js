module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-remove');

  grunt.registerTask('test', ['remove', 'mkdir:test', 'copy:test', 'react:test', 'mochaTest']);
  grunt.registerTask('default', function(){
    console.log(
      ["\nHello developer, use these grunt tasks:\n---------------------------------------\n",
        "grunt test      > run every *__test.js and *__test.jsx file as test",
        "                  (files are processed and copied from ./source to ./tmp_test)"
      ].join("\n")
    );
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    remove: {
      dirList: ['tmp_test']
    },
    mochaTest: {
      options: {
        reporter: 'spec',
        clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
      },
      src: ['tmp_test/node_modules/**/*__test.js']
    },
    react: {
      test: {
        files: [
          {
            expand: true,
            cwd: 'source/node_modules/',
            src: ['**/*.jsx'],
            dest: 'tmp_test/node_modules/',
            ext: '.js'
          }
        ]
      }
    },
    mkdir: {
      test: {
        options: {
          create: ['tmp_test/node_modules']
        }
      }
    },
    clean: {
      test: ["tmp_test"]
    },
    copy: {
      test: {
        files: [
          {expand: true, cwd: '.', src: ['**'], dest: 'tmp_test/node_modules'}
        ]
      }
    },
    watch: {
      files: 'source/node_modules/*',
      tasks: ['default']
    }
  });
};