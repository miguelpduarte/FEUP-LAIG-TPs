class Piece {
	constructor(column, row, color) {
        this.column = column;
        this.row = row;
        this.color = color;
        this.target = null;
        this.column_speed = 0;
        this.row_speed = 0;
    };

    setTarget(target_row, target_column) {
        if (target_row === this.row && target_column === this.column) {
            return;
        }

        this.target = {
            row: target_row,
            column: target_column
        }

        this.column_speed = (target_column - this.column) / Piece.move_time;
        this.row_speed = (target_row - this.row) / Piece.move_time;
    }  
   
    update(delta_time) {
        if (this.target === null) {
            return;
        }

        this.column += this.column_speed * delta_time;
        this.row += this.row_speed * delta_time;

        if (this.targetReached()) {
            this.row = this.target.row;
            this.column = this.target.column;
            this.target = null;
        }
    }

    targetReached() {
        if (Math.sign(this.column_speed) === 1) {
            if (this.column > this.target.column) {
                return true;
            }
        } else if (Math.sign(this.column_speed) === -1) {
            if (this.column < this.target.column) {
                return true;
            }
        } else {
            if (Math.sign(this.row_speed) === 1) {
                if (this.row > this.target.row) {
                    return true;
                }
            } else if (Math.sign(this.row_speed) === -1) {
                if (this.row < this.target.row) {
                    return true;
                }
            }
        }

        return false;
    }
};

Piece.move_time = 2;