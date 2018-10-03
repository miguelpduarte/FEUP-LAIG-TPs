/**
 * Triangle
 * @constructor
 */
class Triangle extends CGFobject {
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);

		this.initBuffers(x1, y1, z1, x2, y2, z2, x3, y3, z3);
	};


	initBuffers(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		this.vertices = [
			x1, y1, z1,
			x2, y2, z2,
			x3, y3, z3
		];

		let v1 = [x2-x1, y2-y1, z2-z1];
		let v2 = [x3-x1, y3-y1, z3-z1];

		let nx = v1[1]*v2[2] - v1[2]*v2[1];
		let ny = v1[2]*v2[0] - v1[0]*v2[2];
		let nz = v1[0]*v2[1] - v1[1]*v2[0];

		this.normals = [
			nx, ny, nz,
			nx, ny, nz,
			nx, ny, nz
		]

		this.indices = [
			0, 1, 2
		];

		this.texCoords = [
			0, 1,
			1, 1,
			0.5, 0
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};