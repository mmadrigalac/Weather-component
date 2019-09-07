module.exports = function(grunt) {

	// grunt configuration init
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),

		jshint:{
			options:{
				esversion: 6
			},
			files:['Gruntfile.js', 'src/js/**/*.js']
		},

    	browserify: {
	      dist: {
	        options: {
	          transform: [["babelify", { "presets": ["@babel/preset-env"] }]]
	        },
	        files: {
	          'src/main.js': 'src/js/**/*.js'
	         }
	      }
	    },

        uglify: {
	        all_src : {
	            options : {
	              sourceMap : true,
	              sourceMapName : 'src/main.map'
	            },
	            src : 'src/main.js',
	            dest : 'src/main.min.js'
	        }
	    },
       

		sass: {                              
			dist: {                            
				files: [{                         
					expand: true,
	        cwd: 'styles',
	        src: ['src/styles/main.scss'],
	        dest: '/src',
	        ext: '.css'					
				}]
			}
		},

		watch: {
			scripts :{
					files: ['<%= jshint.files %>'],
					tasks: ['jshint','browserify']
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
	grunt.registerTask('default', ['jshint','browserify','uglify','sass']);
	grunt.registerTask('watch', ['watch:scripts']);
	grunt.registerTask('dev', ['open:build','serve']);
	grunt.registerTask('css',['sass']);

};