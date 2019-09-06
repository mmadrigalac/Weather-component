module.exports = function(grunt) {

	// grunt configuration init
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),

		jshint:{
			options:{
				esversion: 6
			},
			files:['Gruntfile.js', 'src/**/*.js']
		},

    	babel: {
            options: {
                sourceMap: true,
                presets: ['@babel/preset-env']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: "src/js",
                    src: ["**/*.js"],
                    dest: "build/js-compiled",
                    ext: ".-compiled.js"
                }]
            }
        },

        uglify: {
	        all_src : {
	            options : {
	              sourceMap : true,
	              sourceMapName : 'build/sourceMap.map'
	            },
	            src : 'build/js-compiled/**/*-compiled.js',
	            dest : 'build/main.min.js'
	        }
	    },
       

		sass: {                              
			dist: {                            
				files: [{                         
					expand: true,
	        cwd: 'styles',
	        src: ['src/styles/main.scss'],
	        dest: '/build',
	        ext: '.css'					
				}]
			}
		},

		watch: {
			scripts :{
					files: ['<%= jshint.files %>'],
					tasks: ['jshint','concat','babel']
			}
		},

		open : {
			build : {
				path: 'http://127.0.0.1:9000/index.html',
			}
		}

	});

	
	grunt.loadNpmTasks('grunt-contrib-jshint'); 
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-serve');
	grunt.loadNpmTasks('grunt-babel');

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('default', ['jshint','babel','uglify','sass']);
	grunt.registerTask('watch', ['watch:scripts']);
	grunt.registerTask('dev', ['open:build','serve']);
	grunt.registerTask('css',['sass']);

};