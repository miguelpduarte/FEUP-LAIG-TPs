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

    static swapPlayer() {
        // Only engage motion if no motion is on-going
        if (!this.rotationAmount > 0) {
            this.rotationAmount = Math.PI;
        }    
    }

    static isMoving() {
        return this.rotationAmount > 0;
    }
}

CameraHandler.rotationAmount = 0;
CameraHandler.speed = Math.PI/2e3;