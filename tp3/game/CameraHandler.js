class CameraHandler {
    static setScene(scene) {
        this.scene = scene;
    }

    static update(delta_time) {
        if (this.rotationAmount > 0) {
            let amount = Math.min(this.speed * delta_time, this.rotationAmount);
            this.scene.camera.orbit(CGFcameraAxis.y, amount);
            this.rotationAmount -= amount;
        }
    }

    static swapPlayer(player_type) {
        if (player_type === this.curr_player) {
            // No need to rotate, already in the right position
            return;
        }
        
        // Only engage motion if no motion is ongoing
        if (!this.rotationAmount > 0) {
            this.curr_player = player_type;
            this.rotationAmount = Math.PI;
        }    
    }

    static isMoving() {
        return this.rotationAmount > 0;
    }
}

CameraHandler.rotationAmount = 0;
CameraHandler.speed = Math.PI/2e3;
// The camera starts in the white player
CameraHandler.curr_player = 1;