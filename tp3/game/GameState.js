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
            this.winner = null;

            console.log("Started game successfully");
            // Setting board pieces
            this.scene.board.initPieces(res.board);
            // Possibly also reset clicking state just in case
            //TODO
        } catch(err) {
            console.error("Unable to start game:", err);
        }
    }

    // To be called by ClickHandler
    static async movePiece(x1, y1, x2, y2) {
        // Safety check
        if (this.state === STATE_ENUM.finished) {
            return;
        }

        try {
            const desired_move = [x1, y1, x2, y2];
            const res = await CommunicationHandler.movePiece(this.curr_game_state, desired_move);
            // Success! Updating state!
            this.previous_states.push(this.curr_game_state);
            this.curr_game_state = res;

            console.log("Performed move!", res.performed_move);

            // Updating the board
            const [performed_move_x1, performed_move_y1, performed_move_x2, performed_move_y2] = res.performed_move;

            this.scene.board.performMove(performed_move_x1, performed_move_y1, performed_move_x2, performed_move_y2);

            // Testing if the game is over
            if (res.game_over) {
                console.log("Game is over! Player ", res.winner, " is the winner!");
                this.state = STATE_ENUM.finished;
                this.winner = res.winner;
            }
        } catch(err) {
            console.error("Move piece unsuccessful:", err);
        }
    }

    // 1 = White, 2 = Black
    static getCurrentPlayerColor() {
        return this.curr_game_state.currp[0];
    }

    static isFinished() {
        return this.state === STATE_ENUM.finished;
    }

    static getWinner() {
        return this.winner;
    }
}

GameState.state = STATE_ENUM.initial;
GameState.previous_states = [];
GameState.curr_game_state = null;
GameState.winner = null;
// Only trust backend on this?
GameState.curr_player = 1;