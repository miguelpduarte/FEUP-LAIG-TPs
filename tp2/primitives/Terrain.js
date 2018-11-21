/**
 * Terrain
 * @constructor
 */
class Terrain extends PrimitiveObject {
	constructor(scene, heightScale, divs, createNurbsObject) {
        super(scene);
        
        this.shader = new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");
        // Will be bound to 0
        this.height_map = new CGFtexture(this.scene, "shaders/heightmap_128.jpg");
        // Will be bound to 1
        this.terrain_tex = new CGFtexture(this.scene, "shaders/terrain.jpg");
        
        this.shader.setUniformsValues({heightSampler: 0, terrainSampler: 1, heightScale: heightScale});

		const control_vertexes = 
		[	// U0
			[
				[0.5, 0.0, -0.5, 1],	// V0
				[0.5, 0.0,  0.5, 1]		// V1
			],

			//U1
			[
				[-0.5, 0.0, -0.5, 1],	// V0
				[-0.5, 0.0,  0.5, 1]	// V1
			]
		];

		this.nurbs_object = createNurbsObject(1, 1, control_vertexes, divs, divs);
	};

	display() {
        this.scene.setActiveShader(this.shader);
        this.height_map.bind(0);
        this.terrain_tex.bind(1);
		this.nurbs_object.display();
        this.scene.setActiveShader(this.scene.defaultShader);
	}
};