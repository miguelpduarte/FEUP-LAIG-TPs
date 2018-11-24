const FLAG_SPEED_FACTOR_SCALE = 1e-4;
const FLAG_SPEED_FACTOR_INITIAL = 25;
// Mainly defines for the Interface to constrain input
const FLAG_SPEED_FACTOR_MIN = 0;
const FLAG_SPEED_FACTOR_MAX = 90;

/**
 * Flag
 * @constructor
 */
class Flag extends PrimitiveObject {
	constructor(scene, flag_tex, createNurbsObject) {
		super(scene);

		this.shader = new CGFshader(this.scene.gl, "shaders/flag.vert", "shaders/flag.frag");
		
        // Will be bound to 0
		this.flag_tex = flag_tex;

		this.shader.setUniformsValues({flagSampler: 0, windstrength: 0.1, timefactor: 0});

		this.createObject(createNurbsObject);
	}

	createObject(createNurbsObject) {
		this.nurbs_object = new Plane(this.scene,
            {
                npartsU: 199,
                npartsV: 199
            },
            createNurbsObject
        );
	}

	static setSpeedFactor(speed_factor) {
		this.curr_speed_factor = speed_factor * FLAG_SPEED_FACTOR_SCALE;
	}

	static updateTimeFactor(currTime) {
		this.time_factor = (currTime % 100000) * this.curr_speed_factor;
	}
	
	display() {
		this.scene.setActiveShader(this.shader);
		this.scene.activeShader.setUniformsValues({timefactor: Flag.time_factor});
		this.flag_tex.bind(0);
		
		// Front
		this.scene.pushMatrix();
			this.scene.activeShader.setUniformsValues({is_back: false});
			this.nurbs_object.display();
		this.scene.popMatrix();

		// Back
		this.scene.pushMatrix();
			this.scene.activeShader.setUniformsValues({is_back: true});
			this.scene.rotate(Math.PI, 0, 0, 1);
			this.nurbs_object.display();
		this.scene.popMatrix();
		
        this.scene.setActiveShader(this.scene.defaultShader);
	}
};

Flag.curr_speed_factor = FLAG_SPEED_FACTOR_INITIAL * FLAG_SPEED_FACTOR_SCALE;