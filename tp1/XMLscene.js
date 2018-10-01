const DEGREE_TO_RAD = Math.PI / 180;
const MAX_LIGHTS = 8;

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
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.defaultCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
    }

    /**
     * Initializes the scene cameras.
     */
    defaultCameras() {
        this.default_camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.camera = this.default_camera;
    }

    initCameras() {
        this.cameras = new Map();
        const FOV = 0.4;

        for(let [id, camera] of this.graph.cameras) {
            if(camera.type === "ortho") {
                console.warn("Not creating ortho cameras - ask teacher");
            } else if(camera.type === "perspective") {
                let cam = new CGFcamera(FOV, camera.near, camera.far, vec3.fromValues(...Object.values(camera.from)), vec3.fromValues(...Object.values(camera.to)));
                console.warn("Not using camera angle yet - ask teacher");
                this.cameras.set(id, cam);
            }
        }

        const initial_camera = this.cameras.get(this.graph.defaultViewId);

        if(!initial_camera) {
            console.warn("The specified initial camera was not found!\nUsing a default camera instead");
        }

        this.camera = this.cameras.get(this.graph.defaultViewId) || this.default_camera;
    }

    setLightState(lightId, newVal) {
        const light = this.lights.find(element => {
            return element.id === lightId;
        });

        if(newVal) {
            light.enable();
        } else {
            light.disable();
        }
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        let num_created_lights = 0;
        const lights = this.graph.lights.values();

        console.warn("Change initLights loop to a better looking one");
        let result = lights.next();
        while(!result.done) {
            let light = result.value;

            if (light.type === "omni") {
                this.lights[num_created_lights].setPosition(...Object.values(light.location));
                this.lights[num_created_lights].setAmbient(...Object.values(light.ambient));
                this.lights[num_created_lights].setDiffuse(...Object.values(light.diffuse));
                this.lights[num_created_lights].setSpecular(...Object.values(light.specular));

                this.lights[num_created_lights].setVisible(true);
                this.lights[num_created_lights].id = light.id;
                if(light.enabled) {
                    this.lights[num_created_lights].enable();
                } else {
                    this.lights[num_created_lights].disable();
                }

                this.lights[num_created_lights].update();
            }
            else if (light.type === "spot") {
                console.log("Spot");
                // TODO: this
            }

            // Only eight lights allowed by WebGL.
            if (++num_created_lights == MAX_LIGHTS) {
                break;
            }

            result = lights.next();
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

        // Adds lights checkboxes
        this.interface.createLightsCheckboxes(this.graph.lights);

        this.sceneInited = true;
    }


    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}