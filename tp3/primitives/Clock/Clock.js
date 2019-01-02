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
        this.setTimeTexture(0);
    };

	display() {
        // Clock body
        this.scene.pushMatrix();
            this.scene.translate(0, this.height/2, 0);
            this.scene.scale(this.width, this.height, this.breadth);
            this.plastic_material.apply();
            this.body.display();
        this.scene.popMatrix();

        // Clock display background
        this.scene.pushMatrix();
            this.scene.translate(0, this.height/2, this.breadth/2 + 0.001);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(this.display_width, 1, this.display_height);
            this.display_background_material.apply();
            this.display_part.display();
        this.scene.popMatrix();

        if (ClockState.getState() !== CLOCK_STATE.finished) {
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
        }
        
        // Button
        this.scene.pushMatrix();
            this.scene.translate(0, this.height, 0);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.metal_material.apply();
            this.button.display();
        this.scene.popMatrix();
    }

    setTimeTexture(time) {
        let timeStr = "00" + time;
        timeStr = timeStr.substr(timeStr.length-2);

        this.number_left_material.setTexture(this.number_texture[parseInt(timeStr[0])]);
        this.number_right_material.setTexture(this.number_texture[parseInt(timeStr[1])]);

        // Removing background from previous player wins
        this.display_background_material = this.empty_display_material;
    }

    setDisabledTextures() {
        this.number_left_material.setTexture(this.minus_texture);
        this.number_right_material.setTexture(this.minus_texture);

        // Removing background from previous player wins
        this.display_background_material = this.empty_display_material;
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
        let empty_display_texture = new CGFtexture(this.scene, "primitives/resources/display.png");
        let player1wins_display_texture = new CGFtexture(this.scene, "primitives/resources/player1wins.png");
        let player2wins_display_texture = new CGFtexture(this.scene, "primitives/resources/player2wins.png");
        let metal_texture = new CGFtexture(this.scene, "primitives/resources/metal.jpg");
        this.minus_texture = new CGFtexture(this.scene, "primitives/resources/minus.png");
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

        this.empty_display_material = new CGFappearance(this.scene);
        this.empty_display_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.empty_display_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.empty_display_material.setSpecular(0.6, 0.6, 0.6, 1);
        this.empty_display_material.setEmission(0.3, 0.3, 0.3, 1);
        this.empty_display_material.setShininess(25);
        this.empty_display_material.setTexture(empty_display_texture);

        this.player1wins_display_material = new CGFappearance(this.scene);
        this.player1wins_display_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.player1wins_display_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.player1wins_display_material.setSpecular(0.6, 0.6, 0.6, 1);
        this.player1wins_display_material.setEmission(0.3, 0.3, 0.3, 1);
        this.player1wins_display_material.setShininess(25);
        this.player1wins_display_material.setTexture(player1wins_display_texture);

        this.player2wins_display_material = new CGFappearance(this.scene);
        this.player2wins_display_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.player2wins_display_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.player2wins_display_material.setSpecular(0.6, 0.6, 0.6, 1);
        this.player2wins_display_material.setEmission(0.3, 0.3, 0.3, 1);
        this.player2wins_display_material.setShininess(25);
        this.player2wins_display_material.setTexture(player2wins_display_texture);

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

    setColorTexture(color) {
        let texture;

        switch (color) {
            case CLOCK_COLOR.red:
                texture = this.red_plastic_texture;
                break;
            case CLOCK_COLOR.green:
                texture = this.green_plastic_texture;
                break;
            case CLOCK_COLOR.yellow:
                texture = this.yellow_plastic_texture;
                break;
            default:
                return;
        }
        
        this.plastic_material.setTexture(texture);
    }

    setWinnerTexture() {
        const winner = GameState.getWinner();
        switch (winner) {
            case 1:
                this.display_background_material = this.player1wins_display_material;
                break;
            case 2:
                this.display_background_material = this.player2wins_display_material;
                break;
            default:
                this.display_background_material = this.empty_display_material;
                break;
        }
    }

    updateTextures() {
        this.setColorTexture(ClockState.getColor());

        const curr_clock_state = ClockState.getState();
        switch (curr_clock_state) {
            case CLOCK_STATE.playing:
                this.setTimeTexture(ClockState.getTime());
                break;
            case CLOCK_STATE.disabled:
                this.setDisabledTextures();
                break;
            case CLOCK_STATE.finished:
                this.setWinnerTexture();
                break;
        }

    }
};