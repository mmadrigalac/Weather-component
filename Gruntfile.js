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
				dest: 'built/main.js'
			}
		},

		uglify:{
			options:{
				// banner inserted at the top of min file
				banner:'/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist:{
				files:{
					// target : source
					'built/<%= pkg.name %>.min.js' : ['<%= concat.dist.dest %>']
				}
			}
		},

		browserify: {
      dist: {
        options: {
          transform: ['babelify']
        },
        files: {
          'built/<%= pkg.name %>.js': '<%= concat.dist.dest %>'
        }
      }
    },

		sass: {                              
			dist: {                            
				files: [{                         
					expand: true,
	        cwd: 'styles',
	        src: ['src/styles/main.scss'],
	        dest: '../built',
	        ext: '.css'					
				}]
			}
		},

		watch: {
			scripts :{
					files: ['<%= jshint.files %>'],
					tasks: ['jshint','concat','browserify']
			}
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
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-serve');

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('default', ['jshint','concat','browserify','sass']);
	grunt.registerTask('watch', ['watch:scripts']);
	grunt.registerTask('dev', ['open:build','serve']);
	grunt.registerTask('sass',['sass']);

};