/**
 * Clock
 * @constructor
 */

class Clock extends PrimitiveObject {
	constructor(scene, createNurbsObject) {
        super(scene);

        this.createNurbsObject = createNurbsObject;

        this.height = 0.7;
        this.width = 1.4;
        this.breadth = 0.4;
        this.display_digit_width = 0.24;
        this.display_digit_spacing = 0.05;
        this.display_digit_height = this.display_digit_width*1.5;
        this.display_width = 1;
        this.display_height = this.display_width*0.45;

        this.createMaterials();
        this.createBody();
        this.createButton();
        this.createTimeDisplay();
        this.setTime(0);
    };
    
    countdown(countdown_time_s, callback) {
        this.curr_countdown_time_ms = countdown_time_s * 1000;
        this.curr_countdown_callback = callback;
        // To prevent repeated countdown triggering
        this.counting_down = true;
        this.paused = false;

        this.setTime(Math.floor(this.curr_countdown_time_ms/1000));
    }

    resetCountdown() {
        this.curr_countdown_callback = null;
        this.curr_countdown_time_ms = null;
        this.counting_down = false;
        this.paused = false;
    }

    pauseCountdown() {
        this.paused = true;
    }

    resumeCountdown() {
        this.paused = false;
    }

    updateCountdown(deltaTime) {
        if (this.counting_down && !this.paused) {
            this.curr_countdown_time_ms -= deltaTime;

            this.setTime(Math.floor(this.curr_countdown_time_ms/1000))

            if (this.curr_countdown_time_ms <= 0) {
                // Countdown over, trigger callback and then reset
                this.curr_countdown_callback();
                this.resetCountdown();
                this.setTime(0);
            }
        }
    }

	display() {
        // Clock body
        this.scene.pushMatrix();
            this.scene.translate(0, this.height/2, 0);
            this.scene.scale(this.width, this.height, this.breadth);
            this.plastic_material.apply();
            this.body.display();
        this.scene.popMatrix();

        // Clock display
        this.scene.pushMatrix();
            this.scene.translate(0, this.height/2, this.breadth/2 + 0.001);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(this.display_width, 1, this.display_height);
            this.display_material.apply();
            this.display_part.display();
        this.scene.popMatrix();

        // Clock display left digit
        this.scene.pushMatrix();
            this.scene.translate(-this.display_digit_width/2 - this.display_digit_spacing/2, this.height/2, this.breadth/2 + 0.002);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(this.display_digit_width, 1, this.display_digit_height);
            this.number_left_material.apply();
            this.display_part.display();
        this.scene.popMatrix();

        // Clock display right digit
        this.scene.pushMatrix();
            this.scene.translate(this.display_digit_width/2 + this.display_digit_spacing/2, this.height/2, this.breadth/2 + 0.002);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(this.display_digit_width, 1, this.display_digit_height);
            this.number_right_material.apply();
            this.display_part.display();
        this.scene.popMatrix();
        
        // Button
        this.scene.pushMatrix();
            this.scene.translate(0, this.height, 0);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.metal_material.apply();
            this.scene.registerForPick(Clock.button_pick_id, this.button);
            this.button.display();
        this.scene.popMatrix();
    }

    setTime(time) {
        let timeStr = "00" + time;
        timeStr = timeStr.substr(timeStr.length-2);

        this.number_left_material.setTexture(this.number_texture[parseInt(timeStr[0])]);
        this.number_right_material.setTexture(this.number_texture[parseInt(timeStr[1])]);
    }

    createBody() {
        this.body = new Cube(this.scene, 5, this.createNurbsObject);
    }

    createTimeDisplay() {
        this.display_part = new Plane(
            this.scene, 
            {
                npartsU: 5,
                npartsV: 5
            },
            this.createNurbsObject
        );
    }

    createButton() {
        this.button = new Cylinder(this.scene, 30, 4, this.height/15, this.breadth*7/20, this.breadth*7/20);
        this.button.pickingEnabled = true;
    }

    createMaterials() {
        this.yellow_plastic_texture = new CGFtexture(this.scene, "primitives/resources/yellow_plastic.jpg");
        this.red_plastic_texture = new CGFtexture(this.scene, "primitives/resources/red_plastic.jpg");
        this.green_plastic_texture = new CGFtexture(this.scene, "primitives/resources/green_plastic.jpg");
        let display_texture = new CGFtexture(this.scene, "primitives/resources/display.png");
        let metal_texture = new CGFtexture(this.scene, "primitives/resources/metal.jpg");
        this.number_texture = {}
        this.number_texture[0] = new CGFtexture(this.scene, "primitives/resources/0.png");
        this.number_texture[1] = new CGFtexture(this.scene, "primitives/resources/1.png");
        this.number_texture[2] = new CGFtexture(this.scene, "primitives/resources/2.png");
        this.number_texture[3] = new CGFtexture(this.scene, "primitives/resources/3.png");
        this.number_texture[4] = new CGFtexture(this.scene, "primitives/resources/4.png");
        this.number_texture[5] = new CGFtexture(this.scene, "primitives/resources/5.png");
        this.number_texture[6] = new CGFtexture(this.scene, "primitives/resources/6.png");
        this.number_texture[7] = new CGFtexture(this.scene, "primitives/resources/7.png");
        this.number_texture[8] = new CGFtexture(this.scene, "primitives/resources/8.png");
        this.number_texture[9] = new CGFtexture(this.scene, "primitives/resources/9.png");

        this.plastic_material = new CGFappearance(this.scene);
        this.plastic_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.plastic_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.plastic_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.plastic_material.setEmission(0, 0, 0, 1);
        this.plastic_material.setShininess(25);
        this.plastic_material.setTexture(this.yellow_plastic_texture);

        this.display_material = new CGFappearance(this.scene);
        this.display_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.display_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.display_material.setSpecular(0.6, 0.6, 0.6, 1);
        this.display_material.setEmission(0.3, 0.3, 0.3, 1);
        this.display_material.setShininess(25);
        this.display_material.setTexture(display_texture);

        this.number_left_material = new CGFappearance(this.scene);
        this.number_left_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.number_left_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.number_left_material.setSpecular(0.6, 0.6, 0.6, 1);
        this.number_left_material.setEmission(0.3, 0.3, 0.3, 1);
        this.number_left_material.setShininess(25);

        this.number_right_material = new CGFappearance(this.scene);
        this.number_right_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.number_right_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.number_right_material.setSpecular(0.6, 0.6, 0.6, 1);
        this.number_right_material.setEmission(0.3, 0.3, 0.3, 1);
        this.number_right_material.setShininess(25);

        this.metal_material = new CGFappearance(this.scene);
        this.metal_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.metal_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.metal_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.metal_material.setEmission(0, 0, 0, 1);
        this.metal_material.setShininess(25);
        this.metal_material.setTexture(metal_texture);
    }

    setColor(color) {
        let texture;
        if (color === "red") {
            texture = this.red_plastic_texture;
        } else if (color === "green") {
            texture = this.green_plastic_texture;
        } else {
            return;
        }

        clearTimeout(this.timeout_id);

        this.plastic_material.setTexture(texture);
        
        this.timeout_id = setTimeout(() => {
            this.plastic_material.setTexture(this.yellow_plastic_texture);
        }, 2000);
    }
};

Clock.button_pick_id = 1000;