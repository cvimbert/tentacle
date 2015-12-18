/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {
// Project configuration.
    var srcPath = "public_html/tentacle/js/";
    var buildPath = "public_html/tentacle/build/";
    grunt.initConfig({
        uglify: {
            tentacle: {
                options: {
                    sourceMap: true,
                    //sourceMapRoot: srcPath + "modelmanager",
                    sourceMapName: buildPath + 'tentacle.min.map'
                    
                },
                files: {
                    'public_html/tentacle/build/tentacle.min.js': [srcPath + "tentacle.js", srcPath + 'modelmanager/*.js']
                }
            }
        },
        watch: {
            scripts: {
                files: [srcPath + '*.js'],
                tasks: ['min'],
                options: {
                    spawn: false,
                }
            }
        }

    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('min', ['uglify:tentacle']);
};
