<template>
  <div class="game">
    <a-progress
      :percent="(status.timeRemaining / status.maxTimePerRound) * 100"
      :strokeWidth="20"
      strokeLinecap="square"
      :showInfo="false"
      :format="() => ''"
      strokeColor="#111"
      class="progress"
    />
    <a-button v-if="!isRunning" @click="start">New game</a-button>
    <a-button v-if="isRunning" @click="stop">Bail</a-button>
    <hr />
    <h1 v-if="assignment.assignment && isRunning">
      {{ assignment.assignment.text }}
    </h1>
    {{ msg }}
    <a-input
      v-if="isRunning"
      v-focus
      ref="answer"
      type="number"
      v-model="answer"
      @keyup.enter="solve"
      @focus="$event.target.select()"
      class="answer"
    /><br />
    <a-button v-if="isRunning" @click="solve">solve</a-button><br />

    <a-modal
      :title="modal.title"
      v-model="modal.visible"
      @cancel="modal.closeModal"
      @ok="modal.closeModal"
    >
      <div v-html="modal.contents"></div>
    </a-modal>
  </div>
</template>

<script>
import Game from "../common/game/game";
import { setInterval, clearInterval, setTimeout } from "timers";

const config = {
  numberOfAssignments: 2,
  maxTimePerRound: 30000
};

export default {
  name: "Game",
  data() {
    return {
      assignment: {},
      msg: null,
      status: {
        currentAssignment: 0,
        numberOfAssignments: 0,
        timeRemaining: 0,
        maxTimePerRound: 0,
        score: 0,
        lives: 0
      },
      hasBeenStarted: false,
      isRunning: false,
      heartbeat: null,
      answer: null,
      streak: 0,
      modal: {
        title: "",
        contents: "",
        closeModal: () => {
          this.modal.visible = false;
        },
        visible: false
      }
    };
  },
  mounted() {
    this.game = new Game({
      numberOfAssignments: config.numberOfAssignments,
      maxTimePerRound: config.maxTimePerRound,
      success: this.success,
      failure: this.failure,
      end: this.end
    });
    this.heartbeat = setInterval(() => {
      if (this.isRunning) {
        const {
          currentAssignment,
          numberOfAssignments,
          timeRemaining,
          maxTimePerRound,
          score,
          lives
        } = this.game.getStatus();
        this.status = {
          currentAssignment,
          numberOfAssignments,
          timeRemaining,
          maxTimePerRound,
          score,
          lives
        };
      }
    }, 40);
  },
  beforeDestroy() {
    clearInterval(this.heartbeat);
  },
  methods: {
    setFocus() {
      this.$refs.answer.focus();
    },
    start() {
      if (this.hasBeenStarted) {
        this.reset();
      }
      this.isRunning = true;
      this.hasBeenStarted = true;
      this.game.start();
      this.assignment = this.game.getCurrentAssignment();
      this.setFocus();
    },
    stop() {
      this.isRunning = false;
      this.game.end();
    },
    reset() {
      this.game.reset();

      this.game = new Game({
        numberOfAssignments: config.numberOfAssignments,
        maxTimePerRound: config.maxTimePerRound,
        success: this.success,
        failure: this.failure,
        end: this.end
      });
    },
    solve() {
      if (
        parseInt(this.answer) === parseInt(this.assignment.assignment.solution)
      ) {
        this.streak++;
        this.game.addScore(parseInt(this.status.timeRemaining / 1000));
        if (this.streak % 10 === 0) {
          this.game.addLives(1);
        }
        this.game.next();
        this.assignment = this.game.getCurrentAssignment();
      } else {
        this.streak = 0;
      }
      this.answer = null;
      this.setFocus();
    },
    success() {
      setTimeout(() => {
        this.modal = {
          title: "Level complete! 🎉🎉🎉",
          contents: `<p>You've completed the challenge with a score of <strong>${
            this.status.score
          }</strong>!<br/>💥</p>`,
          closeModal: () => {
            this.modal.visible = false;
            this.stop();
          },
          visible: true
        };
      }, 40);
    },
    failure() {
      this.msg = "Failed";
    },
    end() {
      this.msg = "Ended";
    },
    closeModal() {
      this.modal.visible = false;
    }
  }
};
</script>

<style scoped scss>
.game {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  text-align: center;
}
.progress {
  margin-bottom: 20px;
}

.answer {
  font-size: 8em;
  width: 2em;
  display: inline-block;
  height: auto;
  text-align: center;
}
</style>
