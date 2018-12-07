class ClickHandler {    
    static setScene(scene) {
        this.scene = scene;
    }

    static verifyClicks() {
        if (!this.scene.pickMode) {
            if (this.scene.pickResults !== null && this.scene.pickResults.length > 0) {
                for (let i = 0; i < this.scene.pickResults.length; i++) {
                    let obj = this.scene.pickResults[i][0];
                    if (obj) {
                        let clickId = this.scene.pickResults[i][1];		
                        this.verifyClick(clickId);
                    }
                }
                this.scene.pickResults = [];
            }		
        }
        this.scene.clearPickRegistration();
    }

    static verifyClick(clickId) {
        if (clickId === Clock.button_pick_id) {
            console.log("Clock clicked!!!");
            this.origin = null;
        } else if (clickId >= 0 && clickId < 100) {
            this.handler(clickId);
        }
    }

    static handler(clickId) {
        const column = clickId % 10;
        const row = Math.floor(clickId / 10);

        const current_player = GameState.getCurrentPlayerColor();
        const square_piece = this.scene.board.getSquarePiece(row, column);

        if (!square_piece) {
            this.origin = null;
            this.scene.board.setHighlightedSquare(null);
        }
        else {
            if (square_piece.color === 'light' && current_player === 1 ||
                square_piece.color === 'dark' && current_player === 2) {
                
                this.origin = {row, column};
                this.scene.board.setHighlightedSquare(this.origin);
            } else if (this.origin !== null) {
                GameState.movePiece(this.origin.row, this.origin.column, row, column);
                this.origin = null;
                this.scene.board.setHighlightedSquare(null);
            }
        }
    }
};

ClickHandler.origin = null;
