#!/usr/bin/env node
'use strict';

const useStdIn = (process.argv.indexOf("--stdin") > -1);

const concat = require("concat-stream"),
  cli = require("../lib/cli"),
  path = require("path"),
  fs = require("fs");

process.once("uncaughtException", err => {

  console.error("\nOops! Something went wrong! :(");
  console.error(err.stack);
  process.exitCode = 1;
});

if (useStdIn) {
  process.stdin.pipe(concat({ encoding: "string" }, text => {
    process.exitCode = cli.execute(process.argv, text);
  }));
}
else {
  process.exitCode = cli.execute(process.argv);
}
