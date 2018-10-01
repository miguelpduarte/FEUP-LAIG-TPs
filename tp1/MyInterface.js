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

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {Map} lights
     */
    createLightsCheckboxes(lights) {
        var group = this.gui.addFolder("Lights");

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (let [id, light] of lights) {
            if (light.id) {
                this.model[`light_${light.id}`] = light.enabled;
                group.add(this.model, `light_${light.id}`).name(`Light ${light.id}`).onChange(val => {
                    this.scene.setLightState(light.id, val);
                });
            }
        }
    }
}