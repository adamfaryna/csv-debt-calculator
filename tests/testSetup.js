/*
 * Copyright (C) 2017 Adam Faryna <adamfaryna@appdy.net>
 *
 * Distributed under terms of the BSD 2-Clause license.
 */
const chai = require("chai");
const sinon = require("sinon");
const mockery = require("mockery");

global.expect = chai.expect;
global.mock = sinon.mock;
global.stub = sinon.stub;
global.spy = sinon.spy;
global.createSandbox = sinon.createSandbox;
global.mockery = mockery;
