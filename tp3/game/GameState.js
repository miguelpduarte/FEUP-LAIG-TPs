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
            this.num_pieces_moving = 0;

            console.log("Started game successfully");
            // Setting board pieces
            this.scene.board.initPieces(res.board);
            // Possibly also reset clicking state just in case
            //TODO

            // Starting the AI move chain (does nothing if the current player is a human so all is well)
            this.aiMovePiece();
        } catch(err) {
            console.error("Unable to start game:", err);
        }
    }

    static checkGameOver(res) {
        if (res.game_over) {
            console.log("Game is over! Player ", res.winner, " is the winner!");
            this.state = STATE_ENUM.finished;
            this.winner = res.winner;
        }
    }

    // To be called by ClickHandler
    static async movePiece(x1, y1, x2, y2) {
        // Safety check
        if (this.state !== STATE_ENUM.playing || this.num_pieces_moving !== 0) {
            return;
        }

        try {
            const desired_move = [x1, y1, x2, y2];
            const res = await CommunicationHandler.movePiece(this.curr_game_state, desired_move);
            // Success! Updating state!
            this.previous_states.push(this.curr_game_state);
            this.curr_game_state = res;

            // Signaling that the move was valid
            this.scene.clock.setColor("green");

            console.log("Performed move!", res.performed_move);

            // Updating the board
            const [performed_move_x1, performed_move_y1, performed_move_x2, performed_move_y2] = res.performed_move;

            this.scene.board.performMove(performed_move_x1, performed_move_y1, performed_move_x2, performed_move_y2);

            // Testing if the game is over
            this.checkGameOver(res);
        } catch(err) {
            console.error("Move piece unsuccessful:", err);
            // Signaling that the move was invalid
            this.scene.clock.setColor("red");
        }
    }

    // For AI moves
    static async aiMovePiece() {
        // Check if current player type is non human (1 means human)
        if (this.curr_game_state.currp[1] === 1 || this.state !== STATE_ENUM.playing) {
            return;
        }

        // If it is not, then request the AI move from the API and do the same as above
        try {
            const res = await CommunicationHandler.aiMovePiece(this.curr_game_state);
            // Success! Updating state!
            this.previous_states.push(this.curr_game_state);
            this.curr_game_state = res;

            console.log("Ai performed move!", res.performed_move);

            // Updating the board
            const [performed_move_x1, performed_move_y1, performed_move_x2, performed_move_y2] = res.performed_move;

            this.scene.board.performMove(performed_move_x1, performed_move_y1, performed_move_x2, performed_move_y2);

            // Testing if the game is over
            this.checkGameOver(res);
        } catch(err) {
            console.error("Ai move piece unsuccessful:", err);
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

    static getNrWhite() {
        return this.curr_game_state.nWhite;
    }

    static getNrBlack() {
        return this.curr_game_state.nBlack;
    }

    static pieceStartedMoving() {
        this.num_pieces_moving++;
    }

    static pieceStoppedMoving() {
        this.num_pieces_moving--;
        // Triggering the check for AI moves (used for playing against an AI, or for AI vs AI after the first move)
        if (this.num_pieces_moving === 0) {
            this.aiMovePiece();
        }
    }
}

GameState.state = STATE_ENUM.initial;
GameState.previous_states = [];
GameState.curr_game_state = null;
GameState.winner = null;
GameState.num_pieces_moving = 0;