const SPEED_FACTOR = 5e-5;

/**
 * Water
 * @constructor
 */
class Water extends PrimitiveObject {
	constructor(scene, water_model, createNurbsObject) {
		super(scene);
		
		const {
			heightscale, idwavemap, idtexture, parts, texscale
		} = water_model;

		this.shader = new CGFshader(this.scene.gl, "shaders/water.vert", "shaders/water.frag");
		
        // Will be bound to 0
		this.wave_map = this.scene.textures.get(idwavemap);
		
        // Will be bound to 1
		this.water_tex = this.scene.textures.get(idtexture);

		this.shader.setUniformsValues({waveSampler: 0, waterSampler: 1, heightscale: heightscale, texscale: texscale, timefactor: 0});

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
	}

	static updateTimeFactor(currTime) {
		this.factor = (currTime % 100000) * SPEED_FACTOR;

		// this.factor = (Math.sin((currTime *  3.0) % 3141 * 0.002) + 1.0) * 0.005;
	}
	
	display() {
		this.scene.setActiveShader(this.shader);
		this.scene.activeShader.setUniformsValues({timefactor: Water.factor});
        this.wave_map.bind(0);
        this.water_tex.bind(1);
		this.nurbs_object.display();
        this.scene.setActiveShader(this.scene.defaultShader);
	}
};