/**
 * Cylinder
 * @constructor
 */
class Cylinder extends PrimitiveObject {
	constructor(scene, slices, stacks, height, base, top) {
		super(scene);

		this.slices = slices;
		this.stacks = stacks;
		this.height = height;
		this.base = base;
		this.top = top;
		
		this.side = new CylinderSide(scene, slices, stacks, height, base, top);
		this.circle = new Circle(scene, slices);

		// this.side.initBuffers();
		// this.circle.initBuffers();
	};

	display() {
		//Bottom cover
		this.scene.pushMatrix();
			this.scene.scale(this.base, this.base, 1);
			this.scene.rotate(Math.PI, 0, 1, 0);
			this.circle.display();
		this.scene.popMatrix();
		this.side.display();
		//Top cover
		this.scene.pushMatrix();
			this.scene.translate(0, 0, this.height);
			this.scene.scale(this.top, this.top, 1);
			this.circle.display();
		this.scene.popMatrix();
	}
};