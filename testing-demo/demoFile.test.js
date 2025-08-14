// demoFile.test.js
const { add, subtract, multiply, divide } = require("./demoFile");
const chai = require("chai");
const expect = chai.expect;

describe("Calculator functions", () => {
  describe("add", () => {
    it("should add two positive numbers", () => {
      expect(add(2, 3)).to.equal(5);
    });
    it("should add a positive and a negative number", () => {
      expect(add(5, -2)).to.equal(3);
    });
    it("should add two negative numbers", () => {
      expect(add(-2, -3)).to.equal(-5);
    });
    it("should add zero and a number", () => {
      expect(add(0, 5)).to.equal(5);
      expect(add(5, 0)).to.equal(5);
    });
    it("should add floating-point numbers", () => {
      expect(add(2.5, 3.7)).to.closeTo(6.2, 0.001);
    });
    it("should handle large numbers", () => {
      expect(add(Number.MAX_SAFE_INTEGER, 1)).to.equal(
        Number.MAX_SAFE_INTEGER + 1
      ); //Might throw error depending on JS engine
    });
    it("should handle numbers close to zero", () => {
      expect(add(0.000001, 0.000002)).to.closeTo(0.000003, 0.000001);
    });
    it("should throw an error for non-numeric inputs", () => {
      expect(() => add("2", 3)).to.throw("Inputs must be numbers");
      expect(() => add(2, "3")).to.throw("Inputs must be numbers");
      expect(() => add(true, 3)).to.throw("Inputs must be numbers");
      expect(() => add(2, null)).to.throw("Inputs must be numbers");
      expect(() => add(undefined, 3)).to.throw("Inputs must be numbers");
    });
  });

  describe("subtract", () => {
    it("should subtract two numbers", () => {
      expect(subtract(5, 2)).to.equal(3);
      expect(subtract(2, 5)).to.equal(-3);
      expect(subtract(0, 5)).to.equal(-5);
      expect(subtract(5, 0)).to.equal(5);
      expect(subtract(-2, 5)).to.equal(-7);
      expect(subtract(5, -2)).to.equal(7);
    });
    it("should handle floating-point numbers", () => {
      expect(subtract(5.5, 2.2)).to.closeTo(3.3, 0.001);
    });
  });

  describe("multiply", () => {
    it("should multiply two numbers", () => {
      expect(multiply(5, 2)).to.equal(10);
      expect(multiply(-5, 2)).to.equal(-10);
      expect(multiply(5, -2)).to.equal(-10);
      expect(multiply(-5, -2)).to.equal(10);
      expect(multiply(0, 5)).to.equal(0);
      expect(multiply(5, 0)).to.equal(0);
    });
    it("should handle floating-point numbers", () => {
      expect(multiply(2.5, 3.2)).to.closeTo(8, 0.001);
    });
  });

  describe("divide", () => {
    it("should divide two numbers", () => {
      expect(divide(10, 2)).to.equal(5);
      expect(divide(-10, 2)).to.equal(-5);
      expect(divide(10, -2)).to.equal(-5);
      expect(divide(-10, -2)).to.equal(5);
      expect(divide(10, 1)).to.equal(10);
    });
    it("should handle floating-point numbers", () => {
      expect(divide(10.5, 2.1)).to.closeTo(5, 0.001);
    });
    it("should throw an error for division by zero", () => {
      expect(() => divide(10, 0)).to.throw("Division by zero is not allowed");
    });
  });
});
