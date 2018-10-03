/**
 * Circle
 * @constructor
 */
class Circle extends CGFobject {
	constructor(scene, sides) {
		super(scene);

		this.sides = sides;

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

        let step_angle = 2*Math.PI/this.sides;
        
        //Inserting center
        this.vertices.push(
            0, 0, 0
        )
        this.normals.push(
            0, 0, 1
        )
        this.texCoords.push(
            0.5, 0.5
        )

		for(let i = 0; i <= this.sides; ++i) {
            this.vertices.push(
                Math.cos(step_angle*i), Math.sin(step_angle*i), 0
            );

            this.normals.push(
                0, 0, 1
            );

            this.texCoords.push(
                (Math.cos(step_angle*i)+1)/2, 1 - (Math.sin(step_angle*i)+1)/2
            );
		}

		for (let i = 1; i <= this.sides; ++i) {
            this.indices.push(
                0, i, i+1
            );
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};