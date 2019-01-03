class CameraHandler {
    static setScene(scene) {
        this.scene = scene;
    }

    static update(delta_time) {
        if (this.rotationAmount > 0) {
            let amount = Math.min(this.speed * this.speed_multiplier * delta_time, this.rotationAmount);
            this.rotate(amount);
            this.rotationAmount -= amount;
        }
    }

    static rotate(angle) {
        this.scene.camera.orbit(CGFcameraAxis.y, angle);
    }

    static swapPlayer(player_type) {
        this.speed_multiplier = 1.0;

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

    static menuRotation() {
        this.speed_multiplier = 2.5;
        this.rotationAmount = Math.PI * 2;
    }

    static isMoving() {
        return this.rotationAmount > 0;
    }

    static moveToCurrentPosition() {
        if (this.current_camera === "spectator_camera") {
            return;
        }

        let rotation_amount;

        if (this.isMoving()) {
            let curr_animation_position = Math.PI - this.rotationAmount;
            let player_rotation_amount = (this.curr_player === 1) ? Math.PI : 0;
            rotation_amount = curr_animation_position + player_rotation_amount;
        } else {
            rotation_amount = (this.curr_player - 1) * Math.PI;
        }

        this.rotate(rotation_amount);
    }

    static get zoom_amount() {
        return this.last_zoom;
    }

    static zoomTo(amount) {
        this.scene.camera.zoom(-this.last_zoom);
        this.scene.camera.zoom(amount);
        this.last_zoom = amount;
    }

    static resetZoom() {
        this.zoomTo(0);
    }

    static swapToCurrentCamera() {
        this.scene.camera = this.scene.cameras.get(this.current_camera);
    }

    static setPlayerCamera() {
        this.current_camera = "player_camera";
        this.swapToCurrentCamera();
    }

    static setSpectatorCamera() {
        this.current_camera = "spectator_camera";
        this.swapToCurrentCamera();
    }
}

CameraHandler.current_camera = "spectator_camera";
CameraHandler.rotationAmount = 0;
CameraHandler.speed = Math.PI/2e3;
// The camera starts in the white player
CameraHandler.curr_player = 1;
CameraHandler.last_zoom = 0;