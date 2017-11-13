/*
 * Copyright (C) 2017 Adam Faryna <adamfaryna@appdy.net>
 *
 * Distributed under terms of the BSD 2-Clause license.
 */
const fs = require("fs");
const readline = require("readline");

const LoanBoard = require("./services/loanBoard");
const ArgsUtils = require("./utils/argsUtils");

const argsUtils = new ArgsUtils(process.argv);

argsUtils.checkArgsAndPrintHelpIfNecessary();
argsUtils.validateInputFilename();

const outputFilename = argsUtils.getOutputFilename();

const lineReader = readline.createInterface({
  input: fs.createReadStream(argsUtils.getInputFilename()),
});

const loanBoard = LoanBoard.instance();

lineReader.on("line", line => {
  if (!LoanBoard.isInputLineValid(line)) {
    console.error("Input file format is invalid!");
    process.exit();
  }

  const [ borrower, lender, amount ] = line.split(",");
  loanBoard.addRecord({ borrower, lender, amount: parseFloat(amount) });
});

lineReader.on("close", () => {
  fs.writeFile(outputFilename, loanBoard.toCsv(), err => {
    if (err) return console.error("Write file error");
    console.log(`Result successfully written to '${outputFilename}'.`);
  });
});
