/**
 * Torus
 * @constructor
 */
class Torus extends CGFobject {
	constructor(scene, inner, outer, slices, loops) {
		super(scene);

		this.slices = slices;
		this.loops = loops;
		this.inner_radius = outer-inner;
		this.outer_radius = outer;

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		let step_angle = 2*Math.PI/this.slices;
		let stack_step = 2*Math.PI/this.loops;
		let radius_step = (this.outer_radius - this.inner_radius)/this.loops;

		// Cylinder
		for(let i = 0; i <= this.slices; ++i) {

			for(let j = 0; j <= this.loops; ++j) {

				this.vertices.push(
					(this.outer_radius + this.inner_radius*Math.cos(stack_step*j)) * Math.cos(step_angle*i), 
					(this.outer_radius + this.inner_radius*Math.cos(stack_step*j)) * Math.sin(step_angle*i), 
					this.inner_radius * Math.sin(stack_step*j)
				);

				this.texCoords.push(
					i*1/this.slices, 
					1 - (j*1/this.loops)
				);

				this.normals.push(
					Math.cos(stack_step*j) * Math.cos(step_angle*i), 
                    Math.cos(stack_step*j) * Math.sin(step_angle*i),
                    0
				);

			}

		}

		for (let i = 0; i < this.slices; ++i) {
			for(let j = 0; j < this.loops; ++j) {
				this.indices.push(
					(i+1)*(this.loops+1) + j, i*(this.loops+1) + j+1, i*(this.loops+1) + j,
					i*(this.loops+1) + j+1, (i+1)*(this.loops+1) + j, (i+1)*(this.loops+1) + j+1
				);
			}
		}	

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    };
};