import Timer from "./timer";

describe("Timer class", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should return it's current status", () => {
    const testTimer = new Timer();
    const timerStatus = testTimer.getStatus();

    expect(timerStatus).toEqual({
      callback: null,
      interval: null,
      isRunning: false,
      remainingTime: 0,
      maxTime: 60000
    });
  });

  it("should return the remaining time correctly", () => {
    const testTimer = new Timer({ maxTime: 2000 });
    testTimer.start();
    jest.advanceTimersByTime(1000);
    expect(testTimer.getStatus().remainingTime).toEqual(
      testTimer.getRemainingTime()
    );
    expect(testTimer.getStatus().remainingTime).toEqual(1000);
  });

  it("should be running on starting the timer", () => {
    const testTimer = new Timer();
    testTimer.start();
    expect(testTimer.getStatus().isRunning).toBeTruthy();
  });

  it("should show the remaining time accurately", () => {
    const testTimer = new Timer({ maxTime: 2000 });
    testTimer.start();
    jest.advanceTimersByTime(1000);
    expect(testTimer.getRemainingTime()).toEqual(1000);
  });

  it("should not advance time after stopping", () => {
    const testTimer = new Timer({ maxTime: 2000 });
    testTimer.start();
    jest.advanceTimersByTime(1000);
    testTimer.stop();
    expect(testTimer.getRemainingTime()).toEqual(1000);
    jest.advanceTimersByTime(1000);
    expect(testTimer.getStatus().isRunning).toBeFalsy();
    expect(testTimer.getRemainingTime()).toEqual(1000);
  });

  it("should advance time after stopping and resuming", () => {
    const testTimer = new Timer({ maxTime: 2000 });
    testTimer.start();
    jest.advanceTimersByTime(1000);
    testTimer.stop();
    jest.advanceTimersByTime(1000);
    testTimer.resume();
    expect(testTimer.getStatus().isRunning).toBeTruthy();
    expect(testTimer.getRemainingTime()).toEqual(1000);
    jest.advanceTimersByTime(400);
    expect(testTimer.getRemainingTime()).toEqual(600);
  });

  it("should update the remaining time after providing a new value", () => {
    const testTimer = new Timer({ maxTime: 2000 });
    testTimer.start();
    jest.advanceTimersByTime(1000);
    testTimer.setRemainingTime(4600);
    expect(testTimer.getRemainingTime()).toEqual(4600);
  });

  it("should execute the callback once timer ends", () => {
    const mockCallbackFn = jest.fn();
    const testTimer = new Timer({
      maxTime: 2000,
      onTimerEnd: mockCallbackFn
    });
    testTimer.start();
    jest.runAllTimers();
    expect(mockCallbackFn).toHaveBeenCalledTimes(1);
  });

  it("should handle timer ends when no callback provided", () => {
    const mockCallbackFn = jest.fn();
    const testTimer = new Timer({ maxTime: 1000 });
    testTimer.start();
    jest.runAllTimers();
    expect(mockCallbackFn).toHaveBeenCalledTimes(0);
  });
});
