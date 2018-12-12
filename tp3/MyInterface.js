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
        this.createGameControls();
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

    createGameControls() {
        const playerTypeModel = {
            "Human": 1,
            "Random AI": 2,
            "Beginner AI": 3,
            "Hard AI (SLOW!)": 4
        };

        const group = this.gui.addFolder("Game Controls");

        // Adding player 1 and player 2 type dropdowns
        this.model.p1dif = 1;
        this.model.p2dif = 1;
        group.add(this.model, "p1dif", playerTypeModel)
           .name("Player 1 Type");
        group.add(this.model, "p2dif", playerTypeModel)
           .name("Player 2 Type");

        // Adding start/reset game button
        
        this.model.start_game = () => {
            GameState.initGame(this.model.p1dif, this.model.p2dif);
        };

        group.add(this.model, "start_game")
           .name("Start/Reset Game");

        const undo_redo_group = group.addFolder("Undo/Redo Moves");

        this.model.undo_move = () => {
            GameState.undoMove();
        };

        undo_redo_group.add(this.model, "undo_move")
           .name("Undo Move");

        this.model.redo_move = () => {
            GameState.redoMove();
        };

        undo_redo_group.add(this.model, "redo_move")
           .name("Redo Move");

        this.model.continue_playing = () => {
            GameState.continuePlaying();
        };

        undo_redo_group.add(this.model, "continue_playing")
           .name("Continue Playing");

        // undo_redo_group.open();
        group.open();
    }
}