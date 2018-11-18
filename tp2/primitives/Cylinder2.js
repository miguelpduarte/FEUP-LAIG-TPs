/**
 * Cylinder2
 * @constructor
 */
class Cylinder2 extends PrimitiveObject {
	constructor(scene, cylinder2_model, createNurbsObject) {
		super(scene);
		
		const {
			base, height, slices, stacks, top
        } = cylinder2_model;

        const weight = Math.sqrt(2)/2;
        
        const control_vertexes = 
        [   // U0
            [			
                [ 0, -base, 0,      1 ],          // V0
                [ 0, -top,  height, 1 ]           // V1
            ],
            // U1
            [			
                [ base, -base, 0,      weight ],   // V0
                [ top,  -top,  height, weight ]    // V1
            ],
            // U2
            [			
                [ base,  0, 0,      1 ],          // V0
                [ top,   0, height, 1 ]           // V1
            ],
            // U3
            [
                [ base,  base, 0,      weight ],   // V0
                [ top,   top,  height, weight ]    // V1				 
            ],
            // U4
            [				 
                [ 0,  base, 0,      1 ],          // V0
                [ 0,  top,  height, 1 ]           // V1
                
            ],
            // U5
            [			
                [-base,  base, 0,      weight ],   // V0
                [-top,   top,  height, weight ]    // V1
            ],
            // U6
            [			
                [-base,  0, 0,      1 ],          // V0
                [-top,   0, height, 1 ]           // V1
            ],
            // U7
            [
                [-base, -base, 0,      weight ],   // V0
                [-top,  -top,  height, weight ]    // V1			 
            ],
            // U8
            [				 
                [ 0, -base, 0,      1 ],            // V0
                [ 0, -top,  height, 1 ]             // V1
                
            ]
		];

		/* const control_vertexes_upper = 
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
		
		const control_vertexes_lower = 
		[	// U0
            [				 
                [-base, 0.0, 0.0, 1.0 ],        // V0
                [-top, 0.0, height, 1.0 ]       // V1
                
            ],
            // U1
            [
                [-base, -4/3*base, 0.0, 1.0 ],  // V0
                [-top, -4/3*top, height, 1.0 ]  // V1					 
            ],
            // U2
            [			
                [ base, -4/3*base, 0.0, 1.0 ],  // V0
				[ top, -4/3*top, height, 1.0 ]  // V1
            ],
            // U3
            [			
                [ base, 0.0, 0.0, 1.0 ],        // V0
                [ top, 0.0, height, 1.0 ]       // V1
            ]
		];
        

		this.top_part = createNurbsObject(3, 1, control_vertexes_upper, Math.ceil(slices/2), stacks);      
        this.bottom_part = createNurbsObject(3, 1, control_vertexes_lower, Math.ceil(slices/2), stacks); */
		this.nurbs_object = createNurbsObject(8, 1, control_vertexes, slices, stacks);
	};

	display() {
        /* this.top_part.display();
        this.bottom_part.display(); */
		this.nurbs_object.display();
	}
};