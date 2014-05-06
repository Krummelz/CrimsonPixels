module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-express-server');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        express: {
          dev: {
            options: {
              script: "deploy/server.js"
            }
          }
        },
        concat: {
            dist: {
                src: [
                        "src/lib/**/*.js",
                        "src/game/**/*.js"
                     ],
                dest: 'deploy/public/js/<%= pkg.name %>.js'
            }
        },
        watch: {
            files: 'src/**/*.js',
            tasks: ['concat']
        },
        open: {
            dev: {
                path: 'http://localhost:3002/'
            }
        }
    });

    grunt.registerTask('default', ['concat', 'express', 'open', 'watch']);

}