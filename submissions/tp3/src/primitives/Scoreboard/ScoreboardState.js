const SCOREBOARD_STATE = Object.freeze({
    "playing": 1,
    "finished": 2,
});

class ScoreboardState {
    static getScore() {
        return this.score;
    }

    static setScore(score) {
        // If score is being set, the game is being played
        this.state = SCOREBOARD_STATE.playing;
        this.score = score;
    }

    static getState() {
        return this.state;
    }
    
    static gameFinished() {
        this.state = SCOREBOARD_STATE.finished;
    }
}

ScoreboardState.score = 0;
ScoreboardState.state = SCOREBOARD_STATE.playing;