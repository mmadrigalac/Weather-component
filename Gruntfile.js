module.exports = function(grunt) {

	const sass = require('node-sass');

	// grunt configuration init
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),

		jshint:{
			options:{
				esversion: 6
			},
			files:['Gruntfile.js', 'src/**/*.js','!src/*.min.js','!src/main.js']
		},

    	browserify: {
	      dist: {
	        options: {
	          transform: [["babelify", { "presets": ["@babel/preset-env"] }]]
	        },
	        files: {
	          'src/main.js': ['src/**/*.js','!src/main.js','!src/*.min.js']
	         }
	      }
	    },

        uglify: {
			options : {
				sourceMap : true,
				sourceMapName : 'src/main.map'
			},
	        dev : {
	            src : 'src/main.js',
	            dest : 'src/main.min.js'
			},
			dist :{
				src : 'src/main.js',
	            dest : 'build/main.min.js'
			}
	    },
       

		sass: {        
			options: {                        
            	sourceMap: true
			},
			dev: {    
				files: {
					'src/weatherComponent.css': 'src/styles/main.scss'
				}
			},                      
			dist: {    
				files: {
					'build/weatherComponent.css': 'src/styles/main.scss'
				}
			}
		},

		watch: {
			scripts :{
					files: ['<%= jshint.files %>'],
					tasks: ['jshint','browserify','uglify']
			}
		},

		open : {
			build : {
				path: 'http://localhost:9000/src/index.html',
			}
		}

	});

	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks('grunt-contrib-jshint'); 
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-serve');

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('default', ['jshint','browserify','uglify:dev','sass:dev']);
	grunt.registerTask('check', ['watch:scripts']);
	grunt.registerTask('dev', ['open:build','serve']);
	grunt.registerTask('css',['sass']);

};