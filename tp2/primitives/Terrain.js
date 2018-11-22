/**
 * Terrain
 * @constructor
 */
class Terrain extends PrimitiveObject {
	constructor(scene, terrain_model, createNurbsObject) {
		super(scene);
		
		const {
			heightscale, idheightmap, idtexture, parts
		} = terrain_model;
        
		this.shader = new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");
		
        // Will be bound to 0
		this.height_map = this.scene.textures.get(idheightmap);
		
        // Will be bound to 1
		this.terrain_tex = this.scene.textures.get(idtexture);
        
        this.shader.setUniformsValues({heightSampler: 0, terrainSampler: 1, heightscale: heightscale});

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

		this.nurbs_object = createNurbsObject(1, 1, control_vertexes, parts, parts);
	};

	display() {
        this.scene.setActiveShader(this.shader);
        this.height_map.bind(0);
        this.terrain_tex.bind(1);
		this.nurbs_object.display();
        this.scene.setActiveShader(this.scene.defaultShader);
	}
};