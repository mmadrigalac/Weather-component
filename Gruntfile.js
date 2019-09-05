module.exports = function(grunt) {

  // grunt configuration init
  grunt.initConfig({
    pkg:grunt.file.readJSON('package.json'),

    jshint:{
      files:['Gruntfile.js', 'src/**/*.js']
    },

    concat:{
      options:{
        separator: ';'
      },
      dist:{
        src:['src/**/*.js'],
        dest: 'built/<%= pkg.name %>.js'
      }
    },

    uglify:{
      options:{
        // banner inserted at the top of min file
        banner:'/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist:{
        files:{
          // target : destination
          'built/<%= pkg.name %>.min.js' : ['<%= concat.dist.dest %>']
        }
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint','concat','uglify']
    },

    open : {
      build : {
        path: 'http://127.0.0.1:9000/index.html',
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint'); 
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-serve');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint','concat','uglify']);
  grunt.registerTask('watch', ['watch']);
  grunt.registerTask('dev', ['open:build','serve']);
  


};