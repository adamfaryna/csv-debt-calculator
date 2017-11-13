/*
 * Copyright (C) 2017 Adam Faryna <adamfaryna@appdy.net>
 *
 * Distributed under terms of the BSD 2-Clause license.
 */
const os = require("os");
const { execSync } = require("child_process");
const gulp = require("gulp");
const clean = require("gulp-clean");
const header = require("gulp-header");
const chmod = require("gulp-chmod");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");

const BUILD_DIR = "./dist";
const SRC_DIR = "./src";

function printErrorAndExit(message) {
  console.error(message);
  process.exit();
}

function getNodePath() {
  switch (os.platform()) {
    case "darwin":
    case "linux": return execSync("which node");
    case "win32": printErrorAndExit("Windows platform is not supported!");
    default:
  }
}

gulp.task("build", ["clean"], () => {
  const shebang = `#!${getNodePath()}`;

  return gulp.src(`${SRC_DIR}/index.js`)
    .pipe(webpackStream({ target: "node", output: { filename: "app.js" } }, webpack))
    .pipe(header(shebang))
    .pipe(chmod({ execute: true }))
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task("clean", () => {
  return gulp.src(BUILD_DIR)
    .pipe(clean());
});

gulp.task("default", ["build"]);
