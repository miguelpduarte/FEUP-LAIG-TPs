const STATE_ENUM = Object.freeze({
    initial: 1,
    playing: 2,
    undoing: 3,
    finished: 4
});

// TODO: Undo index? Or just pop when going back? A undo/redo would be cool

class GameState {
    static setScene(scene) {
        this.scene = scene;
    }

    static async initGame(player1_difficulty, player2_difficulty) {
        try {
            const res = await CommunicationHandler.initGame(player1_difficulty, player2_difficulty);
            //Initial state cleanup
            this.state = STATE_ENUM.playing;
            this.curr_game_state = res;
            this.previous_states = [];

            console.log("Started game successfully");
            // reset board pieces here
            //TODO
            // Possibly also reset clicking state just in case
            //TODO
        } catch(err) {
            console.error("Unable to start game:", err);
        }
    }

    // To be called by ClickHandler
    static movePiece(X1, Y1, X2, Y2) {
        // Safety check
        if (this.state === STATE_ENUM.finished) {
            return;
        }
    }

    static isFinished() {
        return this.state === STATE_ENUM.finished;
    }
}

GameState.state = STATE_ENUM.initial;
GameState.previous_states = [];
GameState.curr_game_state = null;
// Only trust backend on this?
GameState.curr_player = 1;