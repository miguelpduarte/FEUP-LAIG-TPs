/**
 * Cube
 * @constructor
 */
class Cube extends PrimitiveObject {
	constructor(scene, num_divs, createNurbsObject) {
		super(scene);

		const control_vertexes = 
		[	// U0
			[
				[-0.5, 0.0,  0.5, 1],	// V0
				[-0.5, 0.0, -0.5, 1]	// V1
			],
			//U1
			[
				[0.5, 0.0,  0.5, 1],	// V0
				[0.5, 0.0, -0.5, 1]		// V1
			]
		];

		this.plane = createNurbsObject(1, 1, control_vertexes, num_divs, num_divs);
	};	

	display() {
		this.scene.pushMatrix();
			this.scene.translate(0.0, 0.5, 0.0);
			this.plane.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.translate(0.0, -0.5, 0.0);
			this.scene.rotate(Math.PI, 1.0, 0.0, 0.0);
			this.plane.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.translate(0.0, 0.0, 0.5);
			this.scene.rotate(Math.PI/2, 1.0, 0.0, 0.0);
			this.plane.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.rotate(Math.PI, 0.0, 1.0, 0.0);
			this.scene.translate(0.0, 0.0, 0.5);
			this.scene.rotate(Math.PI/2, 1.0, 0.0, 0.0);
			this.plane.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.rotate(Math.PI/2, 0.0, 1.0, 0.0);
			this.scene.translate(0.0, 0.0, 0.5);
			this.scene.rotate(Math.PI/2, 1.0, 0.0, 0.0);
			this.plane.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.rotate(-Math.PI/2, 0.0, 1.0, 0.0);
			this.scene.translate(0.0, 0.0, 0.5);
			this.scene.rotate(Math.PI/2, 1.0, 0.0, 0.0);
			this.plane.display();
		this.scene.popMatrix();
	}
};