/*
 * Copyright (C) 2017 Adam Faryna <adamfaryna@appdy.net>
 *
 * Distributed under terms of the BSD 2-Clause license.
 */
describe("LoanBoard", () => {
  let LoanBoard;
  let loanBoard;

  beforeEach(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });
    LoanBoard = require("../../src/services/loanBoard");
    loanBoard = LoanBoard.instance();
  });

  afterEach(() => {
    mockery.disable();
  });

  describe("#isInputLineValid", () => {
    it("should return false for first parameter in line being number rather than string", () => {
      expect(LoanBoard.isInputLineValid("1,Alice,10")).to.be.false;
    });

    it("should return false for second parameter in line being number rather than string", () => {
      expect(LoanBoard.isInputLineValid("Kamil,2,10")).to.be.false;
    });

    it("should return false for third parameter in line being string rather than number", () => {
      expect(LoanBoard.isInputLineValid("Kamil,Alice,ten")).to.be.false;
    });

    it("should return false for improper number of parameters in line", () => {
      expect(LoanBoard.isInputLineValid("Kamil,Alice")).to.be.false;
    });

    it("should return true for proper params", () => {
      expect(LoanBoard.isInputLineValid("Kamil,Alice,10")).to.be.true;
    });
  });

  describe("#addRecord", () => {
    let sandbox;

    beforeEach(() => {
      sandbox = createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should add new record to the board when no similar record not exists yet", () => {
      const boardStub = {};
      sandbox.stub(loanBoard, "board").value(boardStub);
      loanBoard.addRecord({ borrower: "Alan", lender: "Kamila", amount: 50 });
      expect(boardStub).to.have.deep.property("Alan", { Kamila: 50 });
    });

    it("should update existing record when similar record exists", () => {
      const borrower = "Alan";
      const lender = "Kamila";
      const amount = 50;
      const record = { borrower, lender, amount };
      const boardStub = { [borrower]: { [lender]: amount }};
      sandbox.stub(loanBoard, "board").value(boardStub);
      loanBoard.addRecord(record);
      expect(boardStub).to.have.deep.property("Alan", { Kamila: 100 });
    });
  });

  describe("#toCsv", () => {
    let sandbox;
    let boardWithProperData;

    beforeEach(() => {
      boardWithProperData = {
        Alan: {
          Kamila: 50,
          David: 40
        },
        David: {
          Kamila: 20,
          Alan: 10
        }
      };
      sandbox = createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should return board in CSV formatted string with double precision amounts", () => {
      sandbox.stub(loanBoard, "board").value(boardWithProperData);
      expect(loanBoard.toCsv()).to.be.equal("Alan,David,40.00\nAlan,Kamila,50.00\nDavid,Alan,10.00\nDavid,Kamila,20.00");
    });

    it("should sort alphabetical names in result CSV", () => {
      sandbox.stub(loanBoard, "board").value(boardWithProperData);
      expect(loanBoard.toCsv()).to.be.equal("Alan,David,40.00\nAlan,Kamila,50.00\nDavid,Alan,10.00\nDavid,Kamila,20.00");
    });

    it("should return empty string when no records on board", () => {
      sandbox.stub(loanBoard, "board").value({});
      expect(loanBoard.toCsv()).to.be.equal("");
    });
  });
});
