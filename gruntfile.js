module.exports = function(grunt) {

  "use strict";

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-babel');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    "jshint" : {
      options: {
        esnext : true,
        browser : true,
        globals : {
          define : true,
          module : true
        },
      },
      files: {
        src: ['src/vanilla-modal.js']
      }
    },

    "babel" : {
      options : {
        sourceMap : true,
        plugins : [
          "check-es2015-constants",
          "transform-es2015-arrow-functions",
          "transform-es2015-block-scoped-functions",
          "transform-es2015-block-scoping",
          "transform-es2015-classes",
          "transform-es2015-computed-properties",
          "transform-es2015-destructuring",
          "transform-es2015-for-of",
          "transform-es2015-function-name",
          "transform-es2015-literals",
          "transform-es2015-object-super",
          "transform-es2015-parameters",
          "transform-es2015-shorthand-properties",
          "transform-es2015-template-literals",
          "transform-es2015-modules-umd"
        ]
      },
      target : {
        files : {
          "dist/vanilla-modal.js" : "src/vanilla-modal.js"
        }
      }
    },

    "uglify" : {
      target : {
        options : {
          banner: '/**\n * @name <%= pkg.name %>\n * @version <%= pkg.version %>\n * @author Ben Ceglowski\n * @url http://phuse.ca\n * @date <%= grunt.template.today("yyyy-mm-dd") %>\n * @license MIT\n */;',
          report : 'gzip'
        },
        files : {
          "dist/vanilla-modal.min.js" : ["dist/vanilla-modal.js"]
        }
      }
    },

    "watch" : {
      scripts: {
        files: ["src/vanilla-modal.js"],
        tasks: ["build"],
        options: {
          spawn: false,
        }
      }
    }

  });

  grunt.registerTask("default", ["babel", "uglify", "watch"]);
  grunt.registerTask("build", ["jshint", "babel", "uglify"]);
  grunt.registerTask("minify", ["uglify"]);

};