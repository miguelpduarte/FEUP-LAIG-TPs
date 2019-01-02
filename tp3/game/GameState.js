const STATE_ENUM = Object.freeze({
    initial: 1,
    playing: 2,
    undoing: 3,
    finished: 4,
    replaying: 5,
});

const DIFFICULTY_TIME_ENUM = Object.freeze({
    slow: 60,
    fast: 30,
    bullet: 10,
});

class GameState {
    static setScene(scene) {
        this.scene = scene;
    }

    static async initGame(player1_difficulty, player2_difficulty, countdown_speed = "slow") {
        this.countdown_speed = countdown_speed;

        try {
            const res = await CommunicationHandler.initGame(player1_difficulty, player2_difficulty);
            
            //Initial state cleanup
            this.state = STATE_ENUM.playing;
            this.curr_game_state = res;
            this.previous_states = [res];
            this.winner = null;
            this.num_pieces_moving = 0;
            this.current_undo_index = 0;

            // Initializing board state pieces
            BoardState.initPieces(res.board);

            // Initialize score board
            this.scene.scoreBoard.init();
            
            ClickHandler.reset();

            // Starting the player turn - if the player is human starts the clock countdown
            this.startPlayerTurn();

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
            this.triggerGameFinishedActions();
        }
    }

    // To be called by ClickHandler
    static async movePiece(x1, y1, x2, y2) {
        // Safety check
        if (this.state !== STATE_ENUM.playing || this.isAnimationRunning()) {
            return;
        }

        try {
            const desired_move = [x1, y1, x2, y2];
            const res = await CommunicationHandler.movePiece(this.curr_game_state, desired_move);
            // Success! Updating state!
            this.curr_game_state = res;
            this.previous_states.push(this.curr_game_state);
            // Resetting countdown to prevent player loss
            ClockState.resetCountdown();

            // Signaling that the move was valid
            ClockState.setColor(CLOCK_COLOR.green);

            // console.log("Performed move!", res.performed_move);

            // Updating the board
            BoardState.performMove(...res.performed_move);
            // Updating the scoreboard
            this.scene.scoreBoard.setScore(this.getNrWhite() - this.getNrBlack());
            
            // Testing if the game is over
            this.checkGameOver(res);
        } catch(err) {
            // console.error("Move piece unsuccessful:", err);
            // Signaling that the move was invalid
            ClockState.setColor(CLOCK_COLOR.red);
        }
    }

    // For AI moves
    static async aiMovePiece() {
        // Check if current player type is non human (1 means human)
        if (this.curr_game_state.currp[1] === 1 || this.state !== STATE_ENUM.playing) {
            return;
        }

        ClockState.disable();

        // If it is not, then request the AI move from the API and do the same as above
        try {
            const res = await CommunicationHandler.aiMovePiece(this.curr_game_state);
            // Success! Updating state!
            this.curr_game_state = res;
            this.previous_states.push(this.curr_game_state);

            // console.log("Ai performed move!", res.performed_move);

            // Updating the board
            BoardState.performMove(...res.performed_move);
            // Updating the scoreboard
            this.scene.scoreBoard.setScore(this.getNrWhite() - this.getNrBlack());

            // Testing if the game is over
            this.checkGameOver(res);
        } catch(err) {
            // console.error("Ai move piece unsuccessful:", err);
            return;
        }
    }

    static startPlayerTurn() {
        // If the current player is human and we are in the playing state (not undoing or replaying), then start the clock and change the camera
        if (this.isCurrentPlayerHuman() && this.isPlaying()) {
            CameraHandler.swapPlayer(this.getCurrentPlayerColor());
            ClockState.countdown(DIFFICULTY_TIME_ENUM[this.countdown_speed], () => {this.playerTimedOut()});
        }
    }

    static playerTimedOut() {
        console.log("Time's up! Player ", this.getCurrentPlayerColor(), " lost and Player ", this.getOtherPlayerColor(), " won!");
        this.state = STATE_ENUM.finished;
        this.winner = this.getOtherPlayerColor();

        this.triggerGameFinishedActions();
    }

    /**
     * Central function that is always called when the game finishes
     */
    static triggerGameFinishedActions() {
        ClockState.gameFinished();
    }

    static isAnimationRunning() {
        return this.num_pieces_moving !== 0;
    }

    static wasPieceTaken(old_nr_white, new_nr_white, old_nr_black, new_nr_black) {
        if (old_nr_white < new_nr_white) {
            return 1;
        }

        if (old_nr_black < new_nr_black) {
            return 2;
        }

        return 0;
    }

    static undoMove() {
        if (!this.isCurrentPlayerHuman()) {
            console.warn("Cannot undo a move when a non human player is playing");
            return;
        }

        if (this.state !== STATE_ENUM.undoing && this.state !== STATE_ENUM.playing) {
            console.warn("Cannot undo if we are not undoing or playing");
            return;
        }

        if (this.isAnimationRunning()) {
            console.warn("Can't undo in the middle of an animation")
            return;
        }

        if (this.curr_game_state.nTurns === 0) {
            console.warn("No moves to undo yet!");
            return;
        }        

        if (this.current_undo_index >= this.previous_states.length) {
            console.warn("No more moves to undo!");
            return;
        }

        ClockState.pauseCountdown();
        this.state = STATE_ENUM.undoing;

        // Changing game state due to undo
        const old_state = this.curr_game_state;
        this.current_undo_index++;
        this.curr_game_state = this.previous_states[this.previous_states.length - 1 - this.current_undo_index];

        // Update the scoreboard
        this.scene.scoreBoard.setScore(this.getNrWhite() - this.getNrBlack());

        // Do animation by passing information to board
        BoardState.undoMove(...old_state.performed_move, this.wasPieceTaken(old_state.nWhite, this.curr_game_state.nWhite, old_state.nBlack, this.curr_game_state.nBlack));
    }

    static redoMove() {
        if (this.state !== STATE_ENUM.undoing) {
            console.warn("Not in undo mode! Cannot redo!");
            return;
        }

        if (this.isAnimationRunning()) {
            console.warn("Can't redo in the middle of an animation")
            return;
        }

        if (this.current_undo_index === 0) {
            console.warn("No more moves to redo!");
            return;
        }

        // Changing game state due to redo
        this.current_undo_index--;
        this.curr_game_state = this.previous_states[this.previous_states.length - 1 - this.current_undo_index];

        // Update the scoreboard
        this.scene.scoreBoard.setScore(this.getNrWhite() - this.getNrBlack());
 
        // Do animation by passing information to board
        BoardState.performMove(...this.curr_game_state.performed_move);
    }

    static continuePlaying() {
        if (this.state !== STATE_ENUM.undoing) {
            console.warn("Cannot continue playing if not in undoing state!!");
            return;
        }

        if (this.isAnimationRunning()) {
            console.warn("Can't continue playing in the middle of an animation")
            return;
        }

        // Continue playing with current undo level state
        this.previous_states = this.previous_states.slice(0, this.current_undo_index + 1);
        this.current_undo_index = 0;
        ClockState.resumeCountdown();
        this.state = STATE_ENUM.playing;
        // Rotate camera just in case the current player changed
        CameraHandler.swapPlayer(this.getCurrentPlayerColor());
    }

    static replayGame() {
        if (this.state !== STATE_ENUM.finished) {
            console.warn("Cannot replay a non finished game!");
            return;
        }

        ClockState.disable();
        this.state = STATE_ENUM.replaying;
        Piece.setPace(2.5);
        // Set initial board pieces positions
        BoardState.initPieces(this.previous_states[0].board);
        this.replaying_turn = 1;
        this.replayMove();
    }

    static replayMove() {
        if (this.state !== STATE_ENUM.replaying) {
            return;
        }

        this.curr_game_state = this.previous_states[this.replaying_turn];

        // Perform the move of the current state
        BoardState.performMove(...this.curr_game_state.performed_move);
        // Update the scoreboard score as well
        this.scene.scoreBoard.setScore(this.getNrWhite() - this.getNrBlack());

        // Check for game finish
        if (this.replaying_turn < this.previous_states.length - 1) {
            // Move to the next state
            this.replaying_turn++;
        } else {
            // Game over
            this.state = STATE_ENUM.finished;
            Piece.setPace(1);
        }
    }

    // 1 = White, 2 = Black
    static getCurrentPlayerColor() {
        return this.curr_game_state.currp[0];
    }

    static getOtherPlayerColor() {
        return this.curr_game_state.nextp[0];
    }

    static isCurrentPlayerHuman() {
        return this.curr_game_state && this.curr_game_state.currp[1] === 1;
    }

    static isPlaying() {
        return this.state === STATE_ENUM.playing;
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
        // Triggering the check for AI moves (used for playing against an AI, or for AI vs AI after the first move),
        //    for replaying a move or for changing player camera and starting clock countdown
        if (this.num_pieces_moving === 0) {
            this.aiMovePiece();
            this.replayMove();
            this.startPlayerTurn();
        }
    }
}

GameState.state = STATE_ENUM.initial;
GameState.previous_states = [];
GameState.curr_game_state = null;
GameState.winner = null;
GameState.num_pieces_moving = 0;
GameState.current_undo_index = 0;