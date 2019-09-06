import Game from "./game";

jest.mock("./config", () => {
  return {
    parameters: {
      numberOfAssignments: 10,
      numberOfLives: 3,
      maxTimePerRound: 30000
    }
  };
});

describe("Game class", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should return it's current status", () => {
    const testGame = new Game();
    const gameStatus = testGame.getStatus();
    expect(gameStatus).toEqual({
      allAssignments: [],
      currentAssignment: 0,
      maxTimePerRound: 30000,
      numberOfAssignments: 10,
      score: 0,
      timeRemaining: 0,
      lives: 3
    });
  });

  it("should initialize an instance with timers on start", () => {
    const mockSuccessFn = jest.fn();
    const mockFailureFn = jest.fn();
    const testGame = new Game({
      success: mockSuccessFn,
      failure: mockFailureFn
    });
    testGame.start();

    expect(mockFailureFn).toHaveBeenCalledTimes(0);
    expect(testGame.timer.getStatus().isRunning).toBeTruthy();

    jest.runAllTimers();
    expect(mockFailureFn).toHaveBeenCalledTimes(1);
  });

  it("should revert to the original state on reset", () => {
    const testGame = new Game();

    const initialState = testGame.getStatus();
    testGame.start();
    testGame.addLives(1);
    testGame.addScore(10);
    jest.advanceTimersByTime(1000);
    testGame.reset();
    expect(testGame.getStatus()).toEqual(initialState);
  });

  it("should end the game after it has started and no lives are left", () => {
    const mockEndCallbackFn = jest.fn();
    const testGame = new Game({ end: mockEndCallbackFn });

    testGame.start();
    expect(mockEndCallbackFn).toHaveBeenCalledTimes(0);
    testGame.addLives(-4);
    expect(mockEndCallbackFn).toHaveBeenCalledTimes(1);
  });

  it("should return the correct assignment", () => {
    const testGame = new Game({ numberOfAssignments: 5 });
    testGame.start();
    expect(testGame.getCurrentAssignment().index).toEqual(0);

    testGame.next();
    expect(testGame.getCurrentAssignment().index).toEqual(1);

    expect(() => {
      testGame.goToAssignment(-1);
    }).toThrowError("Nothing to see here!");

    testGame.goToAssignment(4);
    testGame.previous();

    expect(testGame.getCurrentAssignment().index).toEqual(3);

    testGame.goToAssignment(0);
    expect(() => {
      testGame.previous();
    }).toThrowError("You are at the beginning!");
  });

  it("should call the success callback after the last assignment", () => {
    const mockSuccessCallbackFn = jest.fn();
    const testGame = new Game({
      numberOfAssignments: 1,
      success: mockSuccessCallbackFn
    });

    const testGameNoCallback = new Game({ numberOfAssignments: 1 });

    testGame.start();
    testGameNoCallback.start();

    expect(mockSuccessCallbackFn).toHaveBeenCalledTimes(0);
    testGameNoCallback.next();
    expect(mockSuccessCallbackFn).toHaveBeenCalledTimes(0);

    expect(mockSuccessCallbackFn).toHaveBeenCalledTimes(0);
    testGame.next();
    expect(mockSuccessCallbackFn).toHaveBeenCalledTimes(1);
  });

  it("should be able to change number of lives to any positive number", () => {
    const testGame = new Game();

    expect(testGame.getLives()).toEqual(3);

    testGame.addLives();
    expect(testGame.getLives()).toEqual(3);

    testGame.addLives(1);
    expect(testGame.getLives()).toEqual(4);

    testGame.addLives(-2);
    expect(testGame.getLives()).toEqual(2);

    testGame.addLives(-30);
    expect(testGame.getLives()).toEqual(0);

    testGame.addLives(3);
    expect(testGame.getLives()).toEqual(3);

    testGame.addLives("abc");
    expect(testGame.getLives()).toEqual(3);
  });

  it("should be able to change score to any positive number", () => {
    const testGame = new Game();

    expect(testGame.getScore()).toEqual(0);

    testGame.addScore();
    expect(testGame.getScore()).toEqual(0);

    testGame.addScore(4);
    expect(testGame.getScore()).toEqual(4);

    testGame.addScore(-2);
    expect(testGame.getScore()).toEqual(2);

    testGame.addScore(-30);
    expect(testGame.getScore()).toEqual(0);

    testGame.addScore(3);
    expect(testGame.getScore()).toEqual(3);

    testGame.addScore("abc");
    expect(testGame.getScore()).toEqual(3);
  });
});
