import { parameters } from "./config";

describe("Game config", () => {
  it("should expose the default configuration", () => {
    expect(parameters).toMatchSnapshot();
  });
});
