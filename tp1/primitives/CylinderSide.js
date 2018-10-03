/**
 * CylinderSide
 * @constructor
 */
class CylinderSide extends CGFobject {
	constructor(scene, slices, stacks, height, base, top) {
		super(scene);

		this.slices = slices;
		this.stacks = stacks;
		this.height = height;
		this.base = base;
		this.top = top;

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		let step_angle = 2*Math.PI/this.slices;
		let stack_step = this.height/this.stacks;
		let radius_step = (this.top - this.base)/this.stacks;

		// Cylinder
		for(let i = 0; i <= this.slices; ++i) {

			for(let j = 0; j <= this.stacks; ++j) {

				this.vertices.push(
					(this.base + radius_step*j) * Math.cos(step_angle*i), 
					(this.base + radius_step*j) * Math.sin(step_angle*i), 
					j*stack_step
				);

				this.texCoords.push(
					i*1/this.slices, 
					1 - (j*1/this.stacks)
				);

				this.normals.push(
					Math.cos(step_angle*i), 
					Math.sin(step_angle*i), 0
				);

			}

		}

		for (let i = 0; i < this.slices; ++i) {
			for(let j = 0; j < this.stacks; ++j) {
				this.indices.push(
					(i+1)*(this.stacks+1) + j, i*(this.stacks+1) + j+1, i*(this.stacks+1) + j,
					i*(this.stacks+1) + j+1, (i+1)*(this.stacks+1) + j, (i+1)*(this.stacks+1) + j+1
				);
			}
		}	

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};