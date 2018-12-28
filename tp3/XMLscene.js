const DEGREE_TO_RAD = Math.PI / 180;
const MAX_LIGHTS = 8;
const UPDATE_RATE = 50; // times/s

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
        this.transformation_factory = new TransformationFactory();
        //Creates a primitive factory for this scene
        this.primitive_factory = new PrimitiveFactory(this);
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        //Move to constructor (?)
        this.sceneInited = false;

        this.initDefaultCamera();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.axisIsActive = false;

        this.createDefaultMaterial();

        this.setUpdatePeriod(1000 / UPDATE_RATE);

        GameState.setScene(this);
        ClickHandler.setScene(this);
        CameraHandler.setScene(this);

        this.setPickEnabled(true);
    }

    update(currTime) {
        // First update
        if (!this.time) {
            this.time = currTime;
            return;
        }

        // update animations
		const delta_time = currTime - this.time;
        this.time = currTime;
        
        
        if (this.sceneInited) {
            this.updateComponentAnimations(delta_time);
            Water.updateTimeFactor(currTime);
            Flag.updateTimeFactor(currTime);
            CameraHandler.update(delta_time);
            this.board && this.board.updateAnimations(delta_time);
            this.clock && this.clock.updateCountdown(delta_time);
        }
    }
    
    updateComponentAnimations(delta_time) {
        for(const [id, component] of this.cgf_components) {
            component.updateAnimations(delta_time);
        }
    }

    createDefaultMaterial() {
        this.defaultMaterial = new CGFappearance(this);
        this.defaultMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.defaultMaterial.setDiffuse(0.5, 0.5, 0.5, 1);
        this.defaultMaterial.setSpecular(0.5, 0.5, 0.5, 1);
        this.defaultMaterial.setEmission(0, 0, 0, 1);
        this.defaultMaterial.setShininess(55);
    }

    initDefaultCamera() {
        this.default_camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.camera = this.default_camera;
    }
    
    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.cameras = new Map();

        for(let [id, camera] of this.graph.cameras) {
            if(camera.type === "ortho") {
                //left, right, bottom, top, near, far, position, target, up
                const cam = new CGFcameraOrtho(
                    camera.left, camera.right, camera.bottom, camera.top,
                    camera.near, camera.far,
                    vec3.fromValues(...Object.values(camera.from)), 
                    vec3.fromValues(...Object.values(camera.to)),
                    vec3.fromValues(0, 1, 0)
                );
                
                this.cameras.set(id, cam);
            } else if(camera.type === "perspective") {
                const cam = new CGFcamera(
                    camera.angle*DEGREE_TO_RAD, camera.near,
                    camera.far, vec3.fromValues(...Object.values(camera.from)),
                    vec3.fromValues(...Object.values(camera.to))
                );

                this.cameras.set(id, cam);
            }
        }

        const initial_camera = this.cameras.get(this.graph.defaultViewId);

        if(!initial_camera) {
            console.warn("The specified initial camera was not found!\nUsing a default camera instead");
        }

        this.camera = initial_camera || this.default_camera;
        this.interface.setActiveCamera(null);
    }

    setCurrentCamera(camera_id) {
        const selected_camera = this.cameras.get(camera_id);

        if(!selected_camera) {
            console.warn(`Camera with id '${camera_id}' was not found, falling back to default camera`);
        }

        this.camera = selected_camera || this.default_camera;
        // this.interface.setActiveCamera(this.camera);
        // this.interface.setActiveCamera(null);
    }

    setLightState(lightId, newVal) {
        const light_index = this.lightsMap[lightId];
        
        if(newVal) {
            this.lights[light_index].enable();
        } else {
            this.lights[light_index].disable();
        }
    }

    rotateMaterials() {
        this.rootComponent.rotateMaterial();
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        let num_created_lights = 0;
        this.lightsMap = {};

        for(let [id, light] of this.graph.lights) {
            this.lights[num_created_lights].setPosition(...Object.values(light.location));
            this.lights[num_created_lights].setAmbient(...Object.values(light.ambient));
            this.lights[num_created_lights].setDiffuse(...Object.values(light.diffuse));
            this.lights[num_created_lights].setSpecular(...Object.values(light.specular));

            if (light.type === "spot") {
                this.lights[num_created_lights].setSpotCutOff(light.angle);
                this.lights[num_created_lights].setSpotExponent(light.exponent);

                let direction = [light.target.x - light.location.x, 
                                 light.target.y - light.location.y,
                                 light.target.z - light.location.z
                                ];

                this.lights[num_created_lights].setSpotDirection(...direction);
            }

            this.lights[num_created_lights].setVisible(true);
            this.lightsMap[id] = num_created_lights;
            if(light.enabled) {
                this.lights[num_created_lights].enable();
            } else {
                this.lights[num_created_lights].disable();
            }

            this.lights[num_created_lights].update();

            // Only eight lights allowed by WebGL.
            if (++num_created_lights == MAX_LIGHTS) {
                break;
            }
        }
    }

    initMaterials() {
        this.materials = new Map();
        for (let [id, material] of this.graph.materials) {
            let mat = new CGFappearance(this);
            mat.setAmbient(...Object.values(material.ambient));
            mat.setDiffuse(...Object.values(material.diffuse));
            mat.setSpecular(...Object.values(material.specular));
            mat.setEmission(...Object.values(material.emission));
            mat.setShininess(material.shininess);
            mat.setTextureWrap('REPEAT', 'REPEAT');
            this.materials.set(id, mat);
        }
    }

    initTextures() {
        this.textures = new Map();
        for (let [id, texture] of this.graph.textures) {
            let tex = new CGFtexture(this, texture.file);
            this.textures.set(id, tex);
        }
    }

    initTransformations() {
        this.transformations = new Map();
        
        for(let [id, transformation_model] of this.graph.transformations) {
            let transf_mat = this.transformation_factory.create(transformation_model);
            this.transformations.set(id, transf_mat);
        }
    }

	toggleAxis() {
        this.axisIsActive = !this.axisIsActive;
	}

	toggleViewLights() {
		for (let light of this.lights) {
            light.setVisible(!light.visible);
        }
	}

    updateLights() {
        for (let light of this.lights) {
            light.update();
        }
    }

    /*
     * Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        // Change referential length according to parsed graph
        this.axis = new CGFaxis(this, this.graph.referentialLength);

        this.gl.clearColor(...Object.values(this.graph.background));
        this.setGlobalAmbientLight(...Object.values(this.graph.ambient));

        this.initLights();
        this.initCameras();
        this.initTransformations();
        //this.initAnimations();
        this.initMaterials();
        this.initTextures();
        this.createSceneGraph();

        this.interface.createInterface();

        this.sceneInited = true;
    }

    createSceneGraph() {
        this.cgf_components = new Map();
        this.cgf_primitives = new Map();

        const primitive_factory = this.primitive_factory;

        //Create primitives
        for(let [id, primitive_model] of this.graph.primitives) {
            const cgf_primitive = primitive_factory.create(primitive_model);
            this.cgf_primitives.set(id, cgf_primitive);

            if (primitive_model.type === "board") {
                this.board = cgf_primitive;
            } else if (primitive_model.type === "clock") {
                this.clock = cgf_primitive;
            } else if (primitive_model.type === "scoreBoard") {
                this.scoreBoard = cgf_primitive;
            }
        }

        //Create components
        for(let [id, component_model] of this.graph.components) {
            const cgf_component = new Component(this, component_model, this.transformation_factory);
            this.cgf_components.set(id, cgf_component);
        }

        //Setting component children
        for(let [id, component] of this.cgf_components) {
            let child_arr = [];
            const component_model = this.graph.components.get(id);
            for(let child_primitive_id of component_model.children.primitiveIds) {
                child_arr.push(this.cgf_primitives.get(child_primitive_id));
            }
            for(let child_component_id of component_model.children.componentIds) {
                child_arr.push(this.cgf_components.get(child_component_id));
            }
            component.setChildren(child_arr);
        }

        this.rootComponent = this.cgf_components.get(this.graph.rootElementId);

        this.textureStack = [];
        this.materialStack = [];

        this.materialStack.push(this.defaultMaterial);
        this.textureStack.push(null);
    }


    /**
     * Displays the scene.
     */
    display() {
        ClickHandler.verifyClicks();
        
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.updateLights();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        
        this.axisIsActive && this.axis.display();

        if (this.sceneInited) {            
            this.rootComponent.display();
        }

        this.popMatrix();
    }
}