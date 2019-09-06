class Timer {
  constructor(config = { maxTime: 60000, onTimerEnd: null }) {
    this.maxTime = config.maxTime;
    this.remainingTime = 0;
    this.isRunning = false;
    this.interval = null;
    this.callback = config.onTimerEnd;
  }

  getStatus() {
    const { maxTime, remainingTime, isRunning, interval, callback } = this;
    return {
      maxTime,
      remainingTime,
      isRunning,
      interval,
      callback
    };
  }

  start() {
    this.reset();
    this.run();
  }

  reset() {
    this.remainingTime = this.maxTime;
  }

  resume() {
    this.run();
  }

  stop() {
    clearInterval(this.interval);
    this.isRunning = false;
  }

  run() {
    const intervalMilliseconds = 40;
    const countdown = () => {
      this.remainingTime -= intervalMilliseconds;
      if (this.remainingTime <= 0) {
        this.outOfTime();
      }
    };
    this.isRunning = true;
    this.interval = setInterval(countdown, intervalMilliseconds);
  }

  getRemainingTime() {
    return this.remainingTime;
  }

  setRemainingTime(timeInMilliseconds) {
    this.remainingTime = timeInMilliseconds;
  }

  outOfTime() {
    this.stop();
    if (this.callback) this.callback();
  }
}

export default Timer;
