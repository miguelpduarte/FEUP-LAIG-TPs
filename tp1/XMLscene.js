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
        
        this.p = new CGFquadPyramid(this, 10, 2);
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

        for(let [id, camera] of this.graph.cameras) {
            if(camera.type === "ortho") {
                console.warn("Not creating ortho cameras - ask teacher");
                // TODO
            } else if(camera.type === "perspective") {
                let cam = new CGFcamera(camera.angle*DEGREE_TO_RAD, camera.near, camera.far, vec3.fromValues(...Object.values(camera.from)), vec3.fromValues(...Object.values(camera.to)));
                console.warn("Not using camera angle yet - ask teacher");
                this.cameras.set(id, cam);
            }
        }

        const initial_camera = this.cameras.get(this.graph.defaultViewId);

        if(!initial_camera) {
            console.warn("The specified initial camera was not found!\nUsing a default camera instead");
        }

        this.camera = this.cameras.get(this.graph.defaultViewId) || this.default_camera;
        this.interface.setActiveCamera(this.camera);
    }

    setLightState(lightId, newVal) {
        const light_index = this.lightsMap[lightId];
        
        if(newVal) {
            this.lights[light_index].enable();
        } else {
            this.lights[light_index].disable();
        }
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
                this.lights[num_created_lights].setSpotCutOff(light.angle * DEGREE_TO_RAD);
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
        this.materials = {};
        for (let [id, material] of this.graph.materials) {
            this.materials[id] = new CGFappearance(this);
            this.materials[id].setAmbient(...Object.values(material.ambient));
            this.materials[id].setDiffuse(...Object.values(material.diffuse));
            this.materials[id].setSpecular(...Object.values(material.specular));
            this.materials[id].setEmission(...Object.values(material.emission));
            this.materials[id].setShininess(material.shininess);
        }
    }

    initTextures() {
        this.textures = {};
        for (let [id, texture] of this.graph.textures) {
            this.textures[id] = new CGFappearance(this);
            this.textures[id].loadTexture(texture.file);
        }
    }

    initPrimitives() {
        let PRIMITIVE_CREATION_FUNCS = {
            "rectangle": this.createRectangle,
            "triangle": this.createTriangle,
            "cylinder": this.createCylinder,
            "sphere": this.createSphere,
            "torus": this.createTorus
        }

        //Binding this
        Object.keys(PRIMITIVE_CREATION_FUNCS)
            .forEach(key => PRIMITIVE_CREATION_FUNCS[key] = PRIMITIVE_CREATION_FUNCS[key].bind(this));

        
        console.log(PRIMITIVE_CREATION_FUNCS);

        this.primitives = {};
        for (let [id, primitive] of this.graph.primitives) {
            PRIMITIVE_CREATION_FUNCS[primitive.type](primitive);
        }
    }

    createRectangle(rectangle) {
        this.primitives[rectangle.id] = new Rectangle(this, 
            rectangle.x1, rectangle.y1, 
            rectangle.x2, rectangle.y2
        ); 
    }

    createSphere(sphere) {
        this.primitives[sphere.id] = new Sphere(this, 
            sphere.slices, 
            sphere.stacks, 
            sphere.radius
        );
    }

    createTriangle(triangle) {
        this.primitives[triangle.id] = new Triangle(this, 
            triangle.x1, triangle.y1, triangle.z1, 
            triangle.x2, triangle.y2, triangle.z2, 
            triangle.x3, triangle.y3, triangle.z3
        );
    }

    createCylinder(cylinder) {
        this.primitives[cylinder.id] = new Cylinder(this, 
            cylinder.slices, 
            cylinder.stacks,
            cylinder.height,
            cylinder.base,
            cylinder.top
        );
    }

    createTorus(torus) {
        // TODO
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
        this.initMaterials();
        this.initTextures();
        this.initPrimitives();

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
        this.updateLights();
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
            // TODO
            Object.values(this.textures)[0].apply();
            for (let item of Object.values(this.primitives)) {
                item.display();
            } 
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}