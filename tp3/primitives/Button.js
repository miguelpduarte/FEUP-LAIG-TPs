/**
 * Button
 * @constructor
 */
class Button extends PrimitiveObject {
	constructor(scene, action) {
		super(scene);

        this.pickIndex = ClickHandler.registerButton(action);
        this.button = new Cylinder(scene, 25, 4, 0.03, 0.1, 0.1);

        this.initMaterials();
		this.initBuffers();
    };

    display() {
        this.scene.translate(0, 0, 0.001);
        this.metal_material.apply();
        this.scene.registerForPick(this.pickIndex, this.button);
        this.button.display();
    }

    initMaterials() {
        let metal_texture = new CGFtexture(this.scene, "primitives/resources/metal.jpg");

        this.metal_material = new CGFappearance(this.scene);
        this.metal_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.metal_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.metal_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.metal_material.setEmission(0, 0, 0, 1);
        this.metal_material.setShininess(25);
        this.metal_material.setTexture(metal_texture);
    }
};