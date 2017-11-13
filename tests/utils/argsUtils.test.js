/*
 * Copyright (C) 2017 Adam Faryna <adamfaryna@appdy.net>
 *
 * Distributed under terms of the BSD 2-Clause license.
 */
describe("ArgsUtils", () => {
  let ArgsUtils;
  let fsMock;
  let consoleErrorStub;
  let consoleInfoStub;
  let processStub;

  before(() => {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });
    fsMock = stub();
    mockery.registerMock("fs", fsMock);
    ArgsUtils = require("../../src/utils/argsUtils");
  });

  after(() => {
    mockery.deregisterMock("fs");
    mockery.disable();
  });

  describe("#validateInputFilename", () => {
    before(() => {
      processStub = stub(process, "exit");
    });

    beforeEach(() => {
      consoleErrorStub = stub(console, "error");
      consoleInfoStub = stub(console, "info");
    });

    after(() => {
      processStub.restore();
    });

    afterEach( () => {
      processStub.reset();
      consoleErrorStub.restore();
      consoleInfoStub.restore();
    });

    it("should print error message when no input file provided", () => {
      const argsUtils = new ArgsUtils(["node", "app"]);
      argsUtils.validateInputFilename();
      expect(consoleErrorStub.calledOnce).to.be.true;
    });

    it("should print help when no input file provided", () => {
      const argsUtils = new ArgsUtils(["node", "app"]);
      argsUtils.validateInputFilename();
      expect(consoleInfoStub.calledOnce).to.be.true;
    });

    it("should print quit when no input file provided", () => {
      const argsUtils = new ArgsUtils(["node", "app"]);
      argsUtils.validateInputFilename();
      expect(processStub.calledOnce).to.be.true;
    });

    it("should print error message when input file does not exists", () => {
      fsMock.existsSync = () => false;
      const argsUtils = new ArgsUtils(["node", "app", "input.csv"]);
      argsUtils.validateInputFilename();
      expect(consoleErrorStub.calledOnce).to.be.true;
    });

    it("should print help when input file does not exists", () => {
      fsMock.existsSync = () => false;
      const argsUtils = new ArgsUtils(["node", "app", "input.csv"]);
      argsUtils.validateInputFilename();
      expect(consoleInfoStub.calledOnce).to.be.true;
    });

    it("should print quit when input file does not exists", () => {
      fsMock.existsSync = () => false;
      const argsUtils = new ArgsUtils(["node", "app", "input.csv"]);
      argsUtils.validateInputFilename();
      expect(processStub.calledOnce).to.be.true;
    });

    it("should process without printing for proper input filename", () => {
      fsMock.existsSync = () => true;
      const argsUtils = new ArgsUtils(["node", "app", "input.csv"]);
      argsUtils.validateInputFilename();
      expect(consoleErrorStub.notCalled).to.be.true;
    });

    it("should process without exiting for proper input filename", () => {
      fsMock.existsSync = () => true;
      const argsUtils = new ArgsUtils(["node", "app", "input.csv"]);
      argsUtils.validateInputFilename();
      expect(processStub.notCalled).to.be.true;
    });
  });

  describe("#shouldPrintHelp", () => {
    beforeEach(() => {
      consoleInfoStub = stub(console, "info");
      processStub = stub(process, "exit");
    });

    afterEach(() => {
      consoleInfoStub.restore();
      processStub.restore();
    });

    it("should print help when no input filename provided", () => {
      const argsUtils = new ArgsUtils(["node", "app"]);
      argsUtils.checkArgsAndPrintHelpIfNecessary();
      expect(consoleInfoStub.calledOnce).to.be.true;
    });

    it("should quit when no input filename provided", () => {
      const argsUtils = new ArgsUtils(["node", "app"]);
      argsUtils.checkArgsAndPrintHelpIfNecessary();
      expect(processStub.calledOnce).to.be.true;
    });

    it("should print help when '--help' argument were passed", () => {
      const argsUtils = new ArgsUtils(["node", "app", "--help"]);
      argsUtils.checkArgsAndPrintHelpIfNecessary();
      expect(consoleInfoStub.calledOnce).to.be.true;
    });

		it("should quit when '--help' argument were passed", () => {
      const argsUtils = new ArgsUtils(["node", "app", "--help"]);
      argsUtils.checkArgsAndPrintHelpIfNecessary();
      expect(processStub.calledOnce).to.be.true;
    });

    it("should not print help when input filename was provided", () => {
      const argsUtils = new ArgsUtils(["node", "app", "input.csv"]);
      argsUtils.checkArgsAndPrintHelpIfNecessary();
      expect(consoleInfoStub.notCalled).to.be.true;
    });

    it("should not quite when input filename was provided", () => {
      const argsUtils = new ArgsUtils(["node", "app", "input.csv"]);
      argsUtils.checkArgsAndPrintHelpIfNecessary();
      expect(processStub.notCalled).to.be.true;
    });
  });

  describe("#printHelp", () => {
    beforeEach(() => {
      consoleInfoStub = stub(console, "info");
    });

    afterEach(() => {
      consoleInfoStub.restore();
    });

    it("should print help content", () => {
      const argsUtils = new ArgsUtils(["node", "app", "input.csv"]);
      argsUtils.printHelp();
      expect(consoleInfoStub.calledOnce).to.be.true;
    });
  });

  describe("#getInputFilename", () => {
    it("should return proper input filename from args", () => {
      const argsUtils = new ArgsUtils(["node", "app", "input.csv"]);
      expect(argsUtils.getInputFilename()).to.be.equal("input.csv");
    });
  });

  describe("#getOutputFilename", () => {
    it("should return proper output filename from args", () => {
      const argsUtils = new ArgsUtils(["node", "app", "input.csv", "output.csv"]);
      expect(argsUtils.getOutputFilename()).to.be.equal("output.csv");
    });

    it("should return default 'output.csv' output filename when none is provided", () => {
      const argsUtils = new ArgsUtils(["node", "app", "input.csv"]);
      expect(argsUtils.getOutputFilename()).to.be.equal("output.csv");
    });
  });
});
