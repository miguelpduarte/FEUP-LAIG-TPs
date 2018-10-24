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

        this.gui = new dat.GUI();

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

        var group = this.gui.addFolder("Lights");

        for (let [id, light] of lights) {
            if (light.id) {
                this.model[`light_${light.id}`] = light.enabled;
                group.add(this.model, `light_${light.id}`)
                    .name(`Light ${light.id}`)
                    .onChange(val => {
                        this.scene.setLightState(light.id, val);
                    });
            }
        }
    }

    createAxisCheckbox() {
        this.model['Axis'] = true;
        this.gui.add(this.model, 'Axis').onChange(val => {
            this.scene.toggleAxis();
        });
    }

    createToggleLightsCheckbox() {
        this.model['Show Lights'] = true;
        this.gui.add(this.model, 'Show Lights').onChange(val => {
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
            .name("Current camera")
            .onChange(val => this.scene.setCurrentCamera(val));
    }
}