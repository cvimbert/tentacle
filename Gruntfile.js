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
        },
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: [srcPath + 'tentacle.js', srcPath + 'modelmanager/*.js'],
                dest: buildPath + 'tentacle.js'
            }
        },
        jsdoc: {
            dist: {
                src: [buildPath + 'tentacle.js'],
                options: {
                    destination: 'public_html/tentacle/doc'
                }
            }
        },
        'jsdoc-ng': {
            'dist': {
                src: [srcPath + 'tentacle.js', srcPath + 'modelmanager/*.js'],
                dest: 'public_html/tentacle/doc',
                template: 'jsdoc-ng',
                options: {
                    
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-jsdoc-ng');
    grunt.registerTask('build', ['uglify:tentacle', 'concat', 'jsdoc:dist']);
};
