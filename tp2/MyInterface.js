/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI({width: 300});

        //Internal data model
        this.model = {};

        // add a group of controls (and open/expand by defult)

        return true;
    }

    createInterface() {
        this.createLightsCheckboxes();
        this.createAxisCheckbox();
        this.createToggleLightsCheckbox();
        this.createCamerasDropdown();
        this.createWaterSpeedSlider();
        this.createFlagSpeedSlider();
        this.createMoveWaterTextureCheckbox();
        this.initKeys();
    }

    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = () => {};
    }

    processKeyDown(event) {

    }

    processKeyUp(event) {
        if(event.code === "KeyM") {
            this.scene.rotateMaterials();
        }
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {Map} lights
     */
    createLightsCheckboxes() {
        const lights = this.scene.graph.lights;

        const group = this.gui.addFolder("Lights");

        for (let [id, light] of lights) {
            if (light.id) {
                this.model[`light_${id}`] = light.enabled;
                group.add(this.model, `light_${id}`)
                    .name(`Light ${id}`)
                    .onChange(val => {
                        this.scene.setLightState(id, val);
                    });
            }
        }
    }

    createAxisCheckbox() {
        this.model['Axis'] = this.scene.axisIsActive;
        this.gui.add(this.model, 'Axis').onChange(val => {
            this.scene.toggleAxis();
        });
    }

    createToggleLightsCheckbox() {
        this.model["Show Lights"] = true;
        this.gui.add(this.model, "Show Lights").onChange(val => {
            this.scene.toggleViewLights();
        });
    }

    createCamerasDropdown() {
        const cameras = this.scene.cameras;

        const cameraDropdownModel = [
            ...cameras.keys()
        ];

        this.model.cameraIndex = this.scene.graph.defaultViewId;

        this.gui.add(this.model, "cameraIndex", cameraDropdownModel)
            .name("Current Camera")
            .onChange(val => this.scene.setCurrentCamera(val));
    }

    createWaterSpeedSlider() {
        this.model.water_speed = WATER_SPEED_FACTOR_INITIAL;

        this.gui.add(this.model, "water_speed", WATER_SPEED_FACTOR_MIN, WATER_SPEED_FACTOR_MAX)
            .name("Water Speed")
            .onFinishChange(val => Water.setSpeedFactor(val));
    }

    createFlagSpeedSlider() {
        this.model.flag_speed = FLAG_SPEED_FACTOR_INITIAL;

        this.gui.add(this.model, "flag_speed", FLAG_SPEED_FACTOR_MIN, FLAG_SPEED_FACTOR_MAX)
            .name("Flag Wave Speed")
            .onFinishChange(val => Flag.setSpeedFactor(val));
    }

    createMoveWaterTextureCheckbox() {
        this.model.move_water_texture = MOVE_WATER_TEXTURE_INITIAL;

        this.gui.add(this.model, "move_water_texture")
            .name("Move Water Texture")
            .onChange(val => Water.setTextureMovement(val));
    }
}