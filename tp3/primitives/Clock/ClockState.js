const CLOCK_STATE = Object.freeze({
    "playing": 1,
    "disabled": 2,
    "finished": 3,
});

const CLOCK_COLOR = Object.freeze({
    "red": 1,
    "yellow": 3,
    "green": 5,
});

class ClockState {
    static getTime() {
        return this.time;
    }

    static setTime(time) {
        this.time = time;
    }

    static countdown(countdown_time_s, callback) {
        // If a countdown exists, we are playing
        this.state = CLOCK_STATE.playing;

        this.curr_countdown_time_ms = countdown_time_s * 1000;
        this.curr_countdown_callback = callback;
        // To prevent repeated countdown triggering
        this.counting_down = true;
        this.paused = false;

        this.setTime(Math.floor(this.curr_countdown_time_ms/1000));
    }

    static resetCountdown() {
        this.curr_countdown_callback = null;
        this.curr_countdown_time_ms = null;
        this.counting_down = false;
        this.paused = false;
    }

    static pauseCountdown() {
        this.paused = true;
    }

    static resumeCountdown() {
        this.paused = false;
    }

    static updateCountdown(deltaTime) {
        if (this.counting_down && !this.paused) {
            this.curr_countdown_time_ms -= deltaTime;

            this.setTime(Math.ceil(this.curr_countdown_time_ms/1000));

            if (this.curr_countdown_time_ms <= 0) {
                // Countdown over, trigger callback and then reset
                this.curr_countdown_callback();
                this.resetCountdown();
                this.setTime(0);
            }
        }
    }

    /**
     * Sets the clock color to the given one for 2 seconds, then returning to yellow
     * @param {*} color 
     */
    static setColor(color) {
        this.color = color;

        clearTimeout(this.timeout_id);
        
        this.timeout_id = setTimeout(() => {
            this.color = CLOCK_COLOR.yellow;
        }, 2000);
    }

    static getColor() {
        return this.color;
    }

    static disable() {
        this.state = CLOCK_STATE.disabled;
    }

    static getState() {
        return this.state;
    }
    
    static gameFinished() {
        this.state = CLOCK_STATE.finished;
    }
}

ClockState.time = 0;
ClockState.color = CLOCK_COLOR.yellow;
ClockState.state = CLOCK_STATE.playing;