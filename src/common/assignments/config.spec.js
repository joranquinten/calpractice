import { operators, ranges } from "./config";

describe("Assignemnts config", () => {
  it("should expose the default configurations", () => {
    expect(operators).toMatchSnapshot();
    expect(ranges).toMatchSnapshot();
  });
});
