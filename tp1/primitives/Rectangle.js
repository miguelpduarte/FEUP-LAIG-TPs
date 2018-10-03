/**
 * Rectangle
 * @constructor
 */
class Rectangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2, minS, maxS, minT, maxT) {
		super(scene);

		this.minS = minS || 0;
		this.maxS = maxS || 1;
		this.minT = minT || 0;
		this.maxT = maxT || 1;

		this.initBuffers(x1, y1, x2, y2);
	};


	initBuffers(x1, y1, x2, y2, minS, maxS, minT, maxT) {
		this.vertices = [
			x1, y1, 0,
			x2, y1, 0,
			x1, y2, 0,
			x2, y2, 0
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		]

		this.indices = [
			0, 1, 2, 
			3, 2, 1
		];

		this.texCoords = [
			this.minS, this.maxT,
			this.maxS, this.maxT,
			this.minS, this.minT,
			this.maxS, this.minT
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};