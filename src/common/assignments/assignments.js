import { operators, ranges } from "./config";

class Assignment {
  constructor(
    config = { numberOfAssignments: 1, complexity: 1, onAssignmentEnd: null }
  ) {
    this.numberOfAssignments = config.numberOfAssignments;
    this.complexity = config.complexity;
    this.assignments = [];
    this.currentIndex = 0;
    this.callback = config.onAssignmentEnd;
    this.operators = operators;
    this.ranges = ranges;
  }

  _getRandomNumber = (low, high) =>
    parseInt(Math.random() * (high - low) + low);

  _getComplexRange = complexity => {
    return this.ranges.reduce(
      (ranges, range) => {
        if (range.complexity <= complexity) {
          if (range.low <= ranges.low) ranges.low = range.low;
          if (range.high >= ranges.high) ranges.high = range.high;
        }
        return ranges;
      },
      { low: 0, high: 0 }
    );
  };

  _getComplexOperator = complexity => {
    return this.operators.reduce((operators, operator) => {
      if (operator.complexity <= complexity) {
        operators.push(operator.operator);
      }
      return operators;
    }, []);
  };

  setComplexity(complexity) {
    this.complexity = complexity;
  }

  getStatus() {
    const {
      numberOfAssignments,
      complexity,
      assignments,
      currentIndex,
      callback
    } = this;
    return {
      numberOfAssignments,
      complexity,
      assignments,
      currentIndex,
      callback
    };
  }

  createAssignment(index, config) {
    const range = this._getComplexRange(this.complexity);
    const operators = this._getComplexOperator(this.complexity);
    const operator =
      config && config.operator
        ? config.operator
        : operators[this._getRandomNumber(0, operators.length)];

    const a = this._getRandomNumber(range.low, range.high);
    const b = this._getRandomNumber(range.low, range.high);

    let assignment = {};
    switch (operator) {
      case "+":
        assignment = { text: `${a} ${operator} ${b}`, solution: a + b };
        break;
      case "-":
        assignment = { text: `${a} ${operator} ${b}`, solution: a - b };
        break;
      case "*":
        assignment = { text: `${a} ${operator} ${b}`, solution: a * b };
        break;
      case "/":
        assignment = { text: `${a} ${operator} ${b}`, solution: a / b };
        break;
    }

    return { index, assignment };
  }

  generateAssignments(numberOfAssignments = this.numberOfAssignments) {
    this.assignments = [];
    for (let i = 0; i < numberOfAssignments; i++) {
      this.assignments.push(this.createAssignment(i));
    }
  }

  getAllAssignments() {
    return this.assignments;
  }
}

export default Assignment;
