/*
 * Copyright (C) 2017 Adam Faryna <adamfaryna@appdy.net>
 *
 * Distributed under terms of the BSD 2-Clause license.
 */
function sort(array) {
  array.sort( (a, b) => a[0].localeCompare(b[0]));
}

let instance;

class LoanBoard {
  static instance() {
    instance = instance || new LoanBoard();
    return instance;
  }

  static isInputLineValid(line) {
    const splits = line.split(",");

    if (splits.length !== 3 ||
        !isNaN(splits[0]) ||
        !isNaN(splits[1]) ||
        isNaN(splits[2])) {
      return false;
    }

    return true;
  }

  constructor() {
    this.board = {};
  }

  addRecord({ borrower, lender, amount }) {
    this.board[borrower] = this.board[borrower] || {};
    this.board[borrower][lender] =
      this.board[borrower][lender] ? this.board[borrower][lender] + amount : amount;
    return this;
  }

  toCsv() {
    const board = Object.entries(this.board);
    sort(board);

    const result =
      board.reduce(
        (prev, crr) => {
          const lenders = Object.entries(crr[1]);
          sort(lenders);

          return (prev ? `${prev}\n` : "")  +
            lenders.reduce(
              (subPrev, subCrr, idx, arr) => `${subPrev}${crr[0]},${subCrr[0]},${subCrr[1].toFixed(2)}${idx === arr.length - 1 ? "" : "\n"}`
            , "");
        }, "");
    return result;
  }
}

module.exports = LoanBoard;
