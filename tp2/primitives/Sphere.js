/**
 * Sphere
 * @constructor
 */
class Sphere extends PrimitiveObject
{
	constructor(scene, slices, stacks, radius)
	{
		super(scene);

		this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		let omega_angle = 2*Math.PI/this.slices;
		let alpha_angle = 2*Math.PI/this.stacks;

		for(let i = 0; i <= this.slices; ++i) {

			for(let j = 0; j <= this.stacks; ++j) {

				this.vertices.push(
                    this.radius*Math.cos(alpha_angle*j)*Math.cos(omega_angle*i), 
                    this.radius*Math.cos(alpha_angle*j)*Math.sin(omega_angle*i), 
                    this.radius*Math.sin(alpha_angle*j)
				);

				this.normals.push(
                    Math.cos(alpha_angle*j)*Math.cos(omega_angle*i), 
                    Math.cos(alpha_angle*j)*Math.sin(omega_angle*i), 
                    Math.sin(alpha_angle*j)
				);

                // TODO: divide by 4 instead of 2 (in X)?
				this.texCoords.push(
                    omega_angle*i / (2*Math.PI),
                    1- ((alpha_angle*j + Math.PI/2) / Math.PI)
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