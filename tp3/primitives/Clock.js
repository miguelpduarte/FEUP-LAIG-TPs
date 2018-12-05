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
        this.display_digit_height = this.display_digit_width*1.5;
        this.display_width = 1;
        this.display_height = this.display_width*0.45;

        this.createMaterials();
        this.createBody();
        this.createButton();
        this.createTimeDisplay();
        this.setTime(0);
	};

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
            this.scene.translate(-this.display_digit_width/2, this.height/2, this.breadth/2 + 0.002);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(this.display_digit_width, 1, this.display_digit_height);
            this.number_left_material.apply();
            this.display_part.display();
        this.scene.popMatrix();

        // Clock display right digit
        this.scene.pushMatrix();
            this.scene.translate(this.display_digit_width/2, this.height/2, this.breadth/2 + 0.002);
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
    }

    createMaterials() {
        let plastic_texture = new CGFtexture(this.scene, "primitives/resources/plastic.jpg");
        let display_texture = new CGFtexture(this.scene, "primitives/resources/display.jpg");
        let metal_texture = new CGFtexture(this.scene, "primitives/resources/metal.jpg");
        this.number_texture = {}
        this.number_texture[0] = new CGFtexture(this.scene, "primitives/resources/0.jpg");
        this.number_texture[1] = new CGFtexture(this.scene, "primitives/resources/1.jpg");
        this.number_texture[2] = new CGFtexture(this.scene, "primitives/resources/2.jpg");
        this.number_texture[3] = new CGFtexture(this.scene, "primitives/resources/3.jpg");
        this.number_texture[4] = new CGFtexture(this.scene, "primitives/resources/4.jpg");
        this.number_texture[5] = new CGFtexture(this.scene, "primitives/resources/5.jpg");
        this.number_texture[6] = new CGFtexture(this.scene, "primitives/resources/6.jpg");
        this.number_texture[7] = new CGFtexture(this.scene, "primitives/resources/7.jpg");
        this.number_texture[8] = new CGFtexture(this.scene, "primitives/resources/8.jpg");
        this.number_texture[9] = new CGFtexture(this.scene, "primitives/resources/9.jpg");

        this.plastic_material = new CGFappearance(this.scene);
        this.plastic_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.plastic_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.plastic_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.plastic_material.setEmission(0, 0, 0, 1);
        this.plastic_material.setShininess(25);
        this.plastic_material.setTexture(plastic_texture);

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
};