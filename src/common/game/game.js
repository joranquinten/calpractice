import Timer from "../timer/timer";
import Assignment from "../assignments/assignments";

import { parameters } from "./config";

class Game {
  constructor(
    config = {
      maxTimePerRound: null,
      numberOfAssignments: null,
      numberOfLives: null,
      success: null,
      failure: null,
      end: null
    }
  ) {
    this.score = 0;
    this.lives = config.numberOfLives || parameters.numberOfLives;
    this.currentAssignment = 0;
    this.numberOfAssignments =
      config.numberOfAssignments || parameters.numberOfAssignments;
    this.maxTimePerRound = config.maxTimePerRound || parameters.maxTimePerRound;
    this.timer = null;
    this.assignments = new Assignment({
      numberOfAssignments: this.numberOfAssignments,
      onAssignmentEnd: this.onSuccess
    });
    this.allAssignments = [];
    this.onSuccess = config.success;
    this.onFailure = config.failure;
    this.onEnd = config.end;
  }

  getStatus() {
    const {
      currentAssignment,
      numberOfAssignments,
      maxTimePerRound,
      allAssignments,
      score,
      lives
    } = this;
    return {
      currentAssignment,
      numberOfAssignments,
      timeRemaining: (this.timer && this.timer.getRemainingTime()) || 0,
      maxTimePerRound,
      allAssignments,
      score,
      lives
    };
  }

  start() {
    this.assignments.generateAssignments();
    this.allAssignments = this.assignments.getAllAssignments();

    this.timer = new Timer({
      maxTime: this.maxTimePerRound,
      onTimerEnd: this.onFailure
    });

    this.timer.start();
  }

  end() {
    if (this.timer) this.timer.stop();
    if (this.onEnd) this.onEnd();
  }

  reset() {
    this.allAssignments = [];

    this.timer.setRemainingTime(0);
    this.currentAssignment = 0;
    this.score = 0;
    this.lives = parameters.numberOfLives;
  }

  getCurrentAssignment() {
    return this.allAssignments[this.currentAssignment];
  }

  goToAssignment(index) {
    if (index > -1 && index <= this.allAssignments.length) {
      this.currentAssignment = index;
      return this.allAssignments[this.currentAssignment];
    } else {
      throw new Error("Nothing to see here!");
    }
  }

  next() {
    if (this.currentAssignment + 1 < this.allAssignments.length) {
      this.currentAssignment++;
    } else {
      if (this.timer) this.timer.stop();
      if (this.onSuccess) this.onSuccess();
    }
  }

  previous() {
    if (this.currentAssignment - 1 >= 0) {
      this.currentAssignment--;
    } else {
      throw Error("You are at the beginning!");
    }
  }

  addLives(mutation = 0) {
    if (!isNaN(mutation)) {
      this.lives += mutation;
      if (this.lives < 0) {
        this.lives = 0;
        this.end();
      }
    }
  }

  getLives() {
    return this.lives;
  }

  addScore(mutation = 0) {
    if (!isNaN(mutation)) {
      this.score += mutation;
      if (this.score < 0) this.score = 0;
    }
  }

  getScore() {
    return this.score;
  }
}

export default Game;
