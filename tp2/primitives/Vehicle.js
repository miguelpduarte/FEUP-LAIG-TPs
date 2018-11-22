/**
 * Vehicle
 * @constructor
 */
class Vehicle extends PrimitiveObject {
	constructor(scene, createNurbsObject) {
        super(scene);

		const ship_body_control_vertexes = 
		[	// U0
            [				 
                [ base, 0.0, 0.0, 1.0 ],        // V0
                [ top, 0.0, height, 1.0 ]       // V1
                
            ],
            // U1
            [
                [ base, 4/3*base, 0.0, 1.0 ],   // V0
                [ top, 4/3*top, height, 1.0 ]	// V1					 
            ],
            // U2
            [			
                [-base, 4/3*base, 0.0, 1.0 ],   // V0
				[-top, 4/3*top, height, 1.0 ]   // V1
            ],
            // U3
            [			
                [-base, 0.0, 0.0, 1.0 ],        // V0
                [-top, 0.0, height, 1.0 ]       // V1
            ]
		];
        

		this.ship_body = createNurbsObject(3, 1, ship_body_control_vertexes, 30, 30);   
	};

	display() {
        this.ship_body.display();
	}
};