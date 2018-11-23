const SPEED_FACTOR_SCALE = 1e-6;
const SPEED_FACTOR_INITIAL = 5;
// Mainly defines for the Interface to constrain input
const SPEED_FACTOR_MIN = 0;
const SPEED_FACTOR_MAX = 60;

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

		this.shader.setUniformsValues({waveSampler: 0, waterSampler: 1, heightscale: heightscale, texscale: texscale, timefactor1: 0, timefactor2: 0});

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

	static setSpeedFactor(speed_factor) {
		this.curr_speed_factor = speed_factor * SPEED_FACTOR_SCALE;
	}

	static updateTimeFactor(currTime) {
		// factor1 is for the S axis and factor2 for the T axis
		this.factor1 = (currTime % 100000) * this.curr_speed_factor;
		this.factor2 = this.factor1 * 5;
	}
	
	display() {
		this.scene.setActiveShader(this.shader);
		this.scene.activeShader.setUniformsValues({timefactor1: Water.factor1, timefactor2: Water.factor2});
        this.wave_map.bind(0);
        this.water_tex.bind(1);
		this.nurbs_object.display();
        this.scene.setActiveShader(this.scene.defaultShader);
	}
};

Water.curr_speed_factor = SPEED_FACTOR_INITIAL * SPEED_FACTOR_SCALE;