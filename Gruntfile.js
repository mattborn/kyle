module.exports = function (grunt) {

  var dest = grunt.option('dest');
  var build = dest ? 'build/'+ dest : 'build/dev';

  grunt.initConfig({
    assemble: {
      options: {
        path: dest === 'prod' ? '/kyle' : '',
        layoutdir: 'src/layouts',
        partials: 'src/partials/**/*.hbs',
        permalinks: {
          preset: 'pretty'
        },
        plugins: 'assemble-contrib-permalinks'
      },
      pages: {
        options: {
          layout: 'pages.hbs'
        },
        files: [{
          cwd: 'src',
          dest: build,
          expand: true,
          src: ['**/*.hbs', '!layouts/**', '!partials/**']
        }]
      },
      posts: {
        options: {
          layout: 'posts.hbs'
        },
        files: [{
          cwd: 'src',
          dest: build,
          expand: true,
          src: '**/*.md'
        }]
      }
    },
    copy: {
      task: {
        files: [
          {
            cwd: 'node_modules/bootstrap/dist',
            expand: true,
            dest: build +'/assets',
            src: '**/*'
          },
          {
            cwd: 'node_modules/jquery/dist',
            expand: true,
            dest: build +'/assets/js',
            src: ['jquery.min.js', 'jquery.min.map']
          },
          {
            dest: build +'/assets/style.css',
            src: 'src/style.css'
          }
        ]
      }
    },
    connect: {
      task: {
        options: {
          base: 'build/dev',
          port: 2015
        }
      }
    },
    watch: {
      assemble: {
        options: {
          livereload: true,
          spawn: false
        },
        files: ['src/**/*.hbs', 'src/**/*.md'],
        tasks: 'assemble'
      },
      styles: {
        options: {
          livereload: true,
          spawn: false
        },
        files: 'src/*.css',
        tasks: 'copy'
      }
    },
    'gh-pages': {
      options: {
        base: 'build/prod'
      },
      src: '**/*'
    }
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('build', [
    'assemble',
    'copy'
  ]);
  grunt.registerTask('deploy', function () {
    grunt.option('dest', 'prod');
    grunt.task.run([
      'build',
      'gh-pages'
    ]);
  });
  grunt.registerTask('default', [
    'build',
    'connect',
    'watch'
  ]);

};