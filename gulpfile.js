/**
 * 热更新配置
 */
const { src, dest,  series, task } = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const nodemon = require('gulp-nodemon');
const tsProject = ts.createProject('tsconfig.json');

function clean(cb) {
  return del(['dist'], cb);
}

function toJs() {
  return src('src/**/*.ts')
    .pipe(tsProject())
    .pipe(dest('dist'));
}

function runNodemon() {
  nodemon({
    inspect: true,
    script: 'server.ts',
    watch: ['src'],
    ext: 'ts', // 监控ts文件
    env: { NODE_ENV: 'development' },
    // tasks: ['build'],
  }).on('crash', () => {
    console.error('应用程序已崩溃!\n');
  });
}

const build = series(clean, toJs);
task('build', build); 
exports.build = build;
exports.default = runNodemon;
