/*
 * Copyright (C) 2017 Adam Faryna <adamfaryna@appdy.net>
 *
 * Distributed under terms of the BSD 2-Clause license.
 */
const fs = require("fs");

class ArgsUtils {
  constructor(args) {
    this.args = args;
  }

  validateInputFilename() {
    const inputFilename = this.getInputFilename();
    let message;

    if (!inputFilename) {
      message = "Input file name must be provided.";

    } else if (!fs.existsSync(inputFilename)) {
      message = `Input file "${inputFilename}" doesn"t exists!`;
    }

    if (message) {
      console.error(message);
      this.printHelp();
      process.exit();
    }
  }

  checkArgsAndPrintHelpIfNecessary() {
    if (this.args.length < 3 || this.args.some(arg => arg === "--help")) {
      this.printHelp();
      process.exit();
    }
  }

  printHelp() {
    const appName = this.args[1].split("/").pop();
    console.info(`
Usage: ${appName} input_cvs output_csv\n
Use "${appName} --help" to print this help.
    `);
  }

  getInputFilename() {
    return this.args[2];
  }

  getOutputFilename() {
    return this.args[3] || "output.csv";
  }
}

module.exports = ArgsUtils;
