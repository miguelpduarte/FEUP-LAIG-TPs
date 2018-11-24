/**
 * Vehicle
 * @constructor
 */
class Vehicle extends PrimitiveObject {
    constructor(scene, createNurbsObject) {
        super(scene);
        this.createNurbsObject = createNurbsObject;

        this.width = 1.5;
        this.height = 2;
        this.length = 4;
        this.floor_height = this.height / 10;

        this.mast_height = 3.4;
        this.mast_diameter = 0.03;

        this.sail_height = 1;
        this.sail_depth = 0.5;
        this.sail_width = 1;

        this.flag_width = 0.46;
        this.flag_height = 0.23;

        this.perry_buoy_size = 0.12;

        this.initMaterials();
        this.createBody();
        this.createMast();
        this.createSails();
        this.createPerryBuoy();
        this.createFlag();
    };

    display() {
        this.scene.scale(0.35, 0.35, 0.35);
        this.scene.translate(0, this.height*2/5, -this.length/2);

        // Ship's Body
        this.scene.pushMatrix();
            this.ship_body_material.apply();
            this.ship_body_outer.display();
            this.ship_body_inner.display();
        this.scene.popMatrix();

        // Ship's Floor
        this.scene.pushMatrix();
            this.floor_material.apply();
            this.ship_floor.display();
        this.scene.popMatrix();

        // Ship's Mast Sail Holders
        this.scene.pushMatrix();
            this.scene.translate(-this.mast_height*3/10, 0.7, this.length * 45 / 100);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.mast_sail_holder.display();
            this.scene.translate(0, this.sail_height*2, 0);
            this.mast_sail_holder.display();
        this.scene.popMatrix();

        // Ship's Mast Sail Holders covers
        this.scene.pushMatrix();
            this.scene.translate(this.mast_height*3/10, 0.7, this.length * 45 / 100);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.scene.scale(this.mast_diameter, this.mast_diameter, 1);
            this.mast_cover.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(this.mast_height*3/10, 0.7 + this.sail_height*2, this.length * 45 / 100);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.scene.scale(this.mast_diameter, this.mast_diameter, 1);
            this.mast_cover.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(-this.mast_height*3/10, 0.7, this.length * 45 / 100);
            this.scene.rotate(-Math.PI/2, 0, 1, 0);
            this.scene.scale(this.mast_diameter, this.mast_diameter, 1);
            this.mast_cover.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(-this.mast_height*3/10, 0.7 + this.sail_height*2, this.length * 45 / 100);
            this.scene.rotate(-Math.PI/2, 0, 1, 0);
            this.scene.scale(this.mast_diameter, this.mast_diameter, 1);
            this.mast_cover.display();
        this.scene.popMatrix();

        // Ship's Mast
        this.scene.pushMatrix();
            this.scene.translate(0, -this.floor_height, this.length * 45 / 100);
            this.scene.rotate(-Math.PI / 2, 1, 0, 0);
            this.mast.display();
        
            this.scene.translate(0, 0, this.mast_height);
            this.mast_top_material.apply();
            this.mast_top.display();
        this.scene.popMatrix();

        // Ship's Sail
        this.scene.pushMatrix();
            this.sail_material.apply();
            this.scene.translate(0, 1.7, this.length * 45 / 100 + 0.015);
            this.ship_sail_front.display();
            this.ship_sail_back.display();
        this.scene.popMatrix();

        // Perry Buoy
        this.scene.pushMatrix();
            this.scene.translate(-0.35, -this.floor_height + this.perry_buoy_size/4, 3.1);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.perry_buoy_material.apply();
            this.perry_buoy.display();
        this.scene.popMatrix();

        // Flag
        this.scene.pushMatrix();
            this.flag_material.apply();
            this.scene.translate(this.flag_width/2, this.mast_height - 2*this.flag_height, this.length * 45 / 100);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(this.flag_width, 1, this.flag_height);
            this.flag.display();
        this.scene.popMatrix();
    }

    initMaterials() {
        this.floor_texture = new CGFtexture(this.scene, "primitives/resources/ship_floor.jpg");
        this.ship_body_texture = new CGFtexture(this.scene, "primitives/resources/ship_body.jpg");
        this.mast_top_texture = new CGFtexture(this.scene, "primitives/resources/ship_mast.png");
        this.sail_texture = new CGFtexture(this.scene, "primitives/resources/sail.jpeg");
        this.perry_buoy_texture = new CGFtexture(this.scene, "primitives/resources/perry_buoy.png");
        this.flag_texture = new CGFtexture(this.scene, "primitives/resources/flag.png");

        this.floor_material = new CGFappearance(this.scene);
        this.floor_material.setAmbient(0.1, 0.1, 0.1, 1);
        this.floor_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.floor_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.floor_material.setEmission(0, 0, 0, 1);
        this.floor_material.setShininess(10);
        this.floor_material.setTexture(this.floor_texture);

        this.ship_body_material = new CGFappearance(this.scene);
        this.ship_body_material.setAmbient(0.15, 0.1, 0.1, 1);
        this.ship_body_material.setDiffuse(0.6, 0.5, 0.5, 1);
        this.ship_body_material.setSpecular(0.5, 0.3, 0.3, 1);
        this.ship_body_material.setEmission(0, 0, 0, 1);
        this.ship_body_material.setShininess(30);
        this.ship_body_material.setTexture(this.ship_body_texture);

        this.mast_top_material = new CGFappearance(this.scene);
        this.mast_top_material.setAmbient(0.1, 0.1, 0.1, 1);
        this.mast_top_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.mast_top_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.mast_top_material.setEmission(0, 0, 0, 1);
        this.mast_top_material.setShininess(30);
        this.mast_top_material.setTexture(this.mast_top_texture);

        this.sail_material = new CGFappearance(this.scene);
        this.sail_material.setAmbient(0.1, 0.1, 0.1, 1);
        this.sail_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.sail_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.sail_material.setEmission(0, 0, 0, 1);
        this.sail_material.setShininess(30);
        this.sail_material.setTexture(this.sail_texture);

        this.perry_buoy_material = new CGFappearance(this.scene);
        this.perry_buoy_material.setAmbient(0.1, 0.1, 0.1, 1);
        this.perry_buoy_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.perry_buoy_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.perry_buoy_material.setEmission(0, 0, 0, 1);
        this.perry_buoy_material.setShininess(30);
        this.perry_buoy_material.setTexture(this.perry_buoy_texture);

        this.flag_material = new CGFappearance(this.scene);
        this.flag_material.setAmbient(0.1, 0.1, 0.1, 1);
        this.flag_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.flag_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.flag_material.setEmission(0, 0, 0, 1);
        this.flag_material.setShininess(30);
        this.flag_material.setTexture(this.flag_texture);
    }

    createBody() {
        const ship_body_outer_control_vertexes =
            [	// U0
                [
                    [0.0, 0.0, 0.0, 1.0],                           // V0
                    [-this.width, 0.0, this.length * 1 / 3, 1.0],   // V1
                    [-this.width, 0.0, this.length * 2 / 3, 1.0],   // V2
                    [0.0, 0.0, this.length, 1.0]                    // V3

                ],
                // U1
                [
                    [0.0, -this.height * 2 / 5, 0.0, 1.0],                  // V0
                    [-this.width, -this.height, this.length * 1 / 3, 1.0],  // V1	
                    [-this.width, -this.height, this.length * 2 / 3, 1.0],  // V2
                    [0.0, -this.height / 10, this.length, 1.0]              // V3					 
                ],
                // U2
                [
                    [0.0, -this.height * 2 / 5, 0.0, 1.0],                  // V0
                    [this.width, -this.height, this.length * 1 / 3, 1.0],   // V1	
                    [this.width, -this.height, this.length * 2 / 3, 1.0],   // V2
                    [0.0, -this.height / 10, this.length, 1.0]	            // V3
                ],
                // U3
                [
                    [0.0, 0.0, 0.0, 1.0],                           // V0
                    [this.width, 0.0, this.length * 1 / 3, 1.0],    // V1
                    [this.width, 0.0, this.length * 2 / 3, 1.0],    // V2
                    [0.0, 0.0, this.length, 1.0]                    // V3
                ]
            ];

        const ship_body_inner_control_vertexes =
            [	// U0
                [
                    [0.0, 0.0, 0.0, 1.0],                           // V0
                    [this.width, 0.0, this.length * 1 / 3, 1.0],    // V1
                    [this.width, 0.0, this.length * 2 / 3, 1.0],    // V2
                    [0.0, 0.0, this.length, 1.0]                    // V3

                ],
                // U1
                [
                    [0.0, -this.height * 2 / 5, 0.0, 1.0],                  // V0
                    [this.width, -this.height, this.length * 1 / 3, 1.0],	// V1	
                    [this.width, -this.height, this.length * 2 / 3, 1.0],   // V2
                    [0.0, -this.height / 10, this.length, 1.0]	            // V3				 
                ],
                // U2
                [
                    [0.0, -this.height * 2 / 5, 0.0, 1.0],                  // V0
                    [-this.width, -this.height, this.length * 1 / 3, 1.0],  // V1	
                    [-this.width, -this.height, this.length * 2 / 3, 1.0],  // V2
                    [0.0, -this.height / 10, this.length, 1.0]              // V3
                ],
                // U3
                [
                    [0.0, 0.0, 0.0, 1.0],                           // V0
                    [-this.width, 0.0, this.length * 1 / 3, 1.0],   // V1
                    [-this.width, 0.0, this.length * 2 / 3, 1.0],   // V2
                    [0.0, 0.0, this.length, 1.0]                    // V3
                ]
            ];

        const ship_floor_control_vertexes =
            [	// U0
                [
                    [0.0, -this.floor_height, 0.0, 1.0],                                    // V0
                    [this.width * 96 / 100, -this.floor_height, this.length * 1 / 3, 1.0],    // V1
                    [this.width * 96 / 100, -this.floor_height, this.length * 2 / 3, 1.0],    // V2
                    [0.0, -this.floor_height, this.length * 98 / 100, 1.0]                  // V3

                ],
                // U1
                [
                    [0.0, -this.floor_height, 0.0, 1.0],                                    // V0
                    [this.width * 96 / 100, -this.floor_height, this.length * 1 / 3, 1.0],	// V1	
                    [this.width * 96 / 100, -this.floor_height, this.length * 2 / 3, 1.0],    // V2
                    [0.0, -this.floor_height, this.length * 98 / 100, 1.0]	                // V3				 
                ],
                // U2
                [
                    [0.0, -this.floor_height, 0.0, 1.0],                                    // V0
                    [-this.width * 96 / 100, -this.floor_height, this.length * 1 / 3, 1.0],   // V1	
                    [-this.width * 96 / 100, -this.floor_height, this.length * 2 / 3, 1.0],   // V2
                    [0.0, -this.floor_height, this.length * 98 / 100, 1.0]                  // V3
                ],
                // U3
                [
                    [0.0, -this.floor_height, 0.0, 1.0],                                    // V0
                    [-this.width * 96 / 100, -this.floor_height, this.length * 1 / 3, 1.0],   // V1
                    [-this.width * 96 / 100, -this.floor_height, this.length * 2 / 3, 1.0],   // V2
                    [0.0, -this.floor_height, this.length * 98 / 100, 1.0]                  // V3
                ]
            ];


        this.ship_body_outer = this.createNurbsObject(3, 3, ship_body_outer_control_vertexes, 30, 30);
        this.ship_body_inner = this.createNurbsObject(3, 3, ship_body_inner_control_vertexes, 30, 30);
        this.ship_floor = this.createNurbsObject(3, 3, ship_floor_control_vertexes, 30, 30);
    }

    createMast() {
        this.mast = new Cylinder2(this.scene,
            {
                base: this.mast_diameter,
                top: this.mast_diameter,
                height: this.mast_height,
                slices: 10,
                stacks: 4
            },
            this.createNurbsObject
        );

        this.mast_sail_holder = new Cylinder2(this.scene,
            {
                base: this.mast_diameter,
                top: this.mast_diameter,
                height: this.mast_height*3/5,
                slices: 10,
                stacks: 4
            },
            this.createNurbsObject
        );
        
        this.mast_top = new Sphere(this.scene, 20, 20, 0.065);
        this.mast_cover = new Circle(this.scene, 10);
    }

    createSails() {
        const sail_front_control_vertexes =
            [	// U = 0
                [
                    [-this.sail_width * 3 / 4, -this.sail_height, 0.0, 1],          // V0
                    [-this.sail_width, -this.sail_height, this.sail_depth, 1],      // V1
                    [-this.sail_width, this.sail_height, this.sail_depth, 1],       // V2
                    [-this.sail_width * 3 / 4, this.sail_height, 0.0, 1]            // V3
                ],
                // U = 1
                [
                    [0, -this.sail_height * 3/4, this.sail_depth / 2, 1],       // V0
                    [0, -this.sail_height, this.sail_depth, 1],                 // V1
                    [0, this.sail_height, this.sail_depth, 1],                  // V2
                    [0, this.sail_height * 3/4, this.sail_depth / 2, 1]         // V3
                ],
                // U = 2
                [
                    [this.sail_width * 3 / 4, -this.sail_height, 0.0, 1],           // V0
                    [this.sail_width, -this.sail_height, this.sail_depth, 1],       // V1
                    [this.sail_width, this.sail_height, this.sail_depth, 1],        // V2
                    [this.sail_width * 3 / 4, this.sail_height, 0.0, 1]             // V3
                ]
            ];

        const sail_back_control_vertexes =
            [	// U = 0
                [
                    [this.sail_width * 3 / 4, -this.sail_height, 0.0, 1],           // V0
                    [this.sail_width, -this.sail_height, this.sail_depth, 1],       // V1
                    [this.sail_width, this.sail_height, this.sail_depth, 1],        // V2
                    [this.sail_width * 3 / 4, this.sail_height, 0.0, 1]             // V3
                ],
                // U = 1
                [
                    [0, -this.sail_height * 3/4, this.sail_depth / 2, 1],       // V0
                    [0, -this.sail_height, this.sail_depth, 1],                 // V1
                    [0, this.sail_height, this.sail_depth, 1],                  // V2
                    [0, this.sail_height * 3/4, this.sail_depth / 2, 1]         // V3
                ],
                // U = 2
                [
                    [-this.sail_width * 3 / 4, -this.sail_height, 0.0, 1],         // V0
                    [-this.sail_width, -this.sail_height, this.sail_depth, 1],     // V1
                    [-this.sail_width, this.sail_height, this.sail_depth, 1],      // V2
                    [-this.sail_width * 3 / 4, this.sail_height, 0.0, 1]           // V3
                ]
            ];

        this.ship_sail_front = this.createNurbsObject(2, 3, sail_front_control_vertexes, 30, 30);
        this.ship_sail_back = this.createNurbsObject(2, 3, sail_back_control_vertexes, 30, 30);
    }

    createPerryBuoy() {
        this.perry_buoy = new Torus(this.scene, 
            this.perry_buoy_size/4, 
            this.perry_buoy_size, 
            20, 
            20
        );
    }

    createFlag() {
        this.flag = new Flag(this.scene, this.flag_texture, this.createNurbsObject);
    }
}