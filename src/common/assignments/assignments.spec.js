import Assignment from "./assignments";

jest.mock("./config", () => {
  return {
    operators: [
      { complexity: 1, operator: "+" },
      { complexity: 2, operator: "-" },
      { complexity: 3, operator: "*" },
      { complexity: 4, operator: "/" }
    ],
    ranges: [
      { complexity: 1, low: 0, high: 10 },
      { complexity: 2, low: 1, high: 100 },
      { complexity: 2, low: -10, high: 75 }
    ]
  };
});

describe("Assignments class", () => {
  it("should return it's current status", () => {
    const testAssignment = new Assignment();
    const assignmentStatus = testAssignment.getStatus();

    expect(assignmentStatus).toEqual({
      assignments: [],
      complexity: 1,
      currentIndex: 0,
      numberOfAssignments: 1,
      callback: null
    });
  });

  it("should return the full available range based on complexity", () => {
    const testAssignment = new Assignment();

    const simpleRange = testAssignment._getComplexRange(1);
    expect(simpleRange.low).toEqual(0);
    expect(simpleRange.high).toEqual(10);

    const complexRange = testAssignment._getComplexRange(2);
    expect(complexRange.low).toEqual(-10);
    expect(complexRange.high).toEqual(100);
  });

  it("should return the full available operators based on complexity", () => {
    const testAssignment = new Assignment();

    const simpleOperator = testAssignment._getComplexOperator(1);
    expect(simpleOperator).toEqual(["+"]);

    const complexOperator = testAssignment._getComplexOperator(4);
    expect(complexOperator).toEqual(["+", "-", "*", "/"]);
  });

  it("should be able to set the complexity", () => {
    const testAssignment = new Assignment({
      numberOfAssignments: 1,
      complexity: 2
    });
    expect(testAssignment.getStatus().complexity).toEqual(2);

    testAssignment.setComplexity(1);
    expect(testAssignment.getStatus().complexity).toEqual(1);
  });

  it("should generate assignments based on operator", () => {
    const testAssignment = new Assignment();

    expect(
      testAssignment.createAssignment(1, { operator: "+" }).assignment.text
    ).toContain("+");
    expect(
      testAssignment.createAssignment(1, { operator: "-" }).assignment.text
    ).toContain("-");
    expect(
      testAssignment.createAssignment(1, { operator: "*" }).assignment.text
    ).toContain("*");
    expect(
      testAssignment.createAssignment(1, { operator: "/" }).assignment.text
    ).toContain("/");
  });

  it("should be able to generate assignments", () => {
    const testAssignment = new Assignment();
    expect(testAssignment.createAssignment(1).index).toEqual(1);

    testAssignment.generateAssignments(2);
    expect(testAssignment.getAllAssignments().length).toEqual(2);

    testAssignment.generateAssignments();
    expect(testAssignment.getAllAssignments().length).toEqual(1);
  });
});
