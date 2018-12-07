class Piece {
	constructor(column, row, color) {
        this.column = column;
        this.row = row;
        this.height = 0;
        this.color = color;
        this.target = null;
        this.target_mid_point = null;
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

        this.target_mid_point = {
            row: this.row + (target_row - this.row)/2,
            column: this.column + (target_column - this.column)/2
        }
        this.total_distance_mid_point = Math.sqrt(Math.pow(this.row - this.target_mid_point.row, 2) + Math.pow(this.column - this.target_mid_point.column, 2));
        this.height_multiplier = Math.max(this.total_distance_mid_point, 2);

        this.move_time = Math.min(2, this.total_distance_mid_point);
        this.column_speed = (target_column - this.column) / this.move_time;
        this.row_speed = (target_row - this.row) / this.move_time;
        
    }  
   
    update(delta_time) {
        if (this.target === null) {
            return;
        }

        this.column += this.column_speed * delta_time;
        this.row += this.row_speed * delta_time;

        let distance_mid_point = Math.sqrt(Math.pow(this.row - this.target_mid_point.row, 2) + Math.pow(this.column - this.target_mid_point.column, 2));
        

        this.height = (this.total_distance_mid_point - Math.pow(distance_mid_point, 2)/this.total_distance_mid_point) * 1/this.height_multiplier;

        if (this.targetReached()) {
            this.row = this.target.row;
            this.column = this.target.column;
            this.height = 0;
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