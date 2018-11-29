/**
 * Piece
 * @constructor
 */
class Piece extends PrimitiveObject {
	constructor(scene, createNurbsObject) {
        super(scene);

        this.createNurbsObject = createNurbsObject;

        this.createPieceBase();
        this.createBody();
        this.createPieceWave1();
        this.createPieceWave2();
        this.createPieceWave3();
        this.createHead();
        this.createBottom();
	};

	display() {
        this.scene.pushMatrix();
            this.piece_base.display();
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.piece_base.display();
        this.scene.popMatrix();  
        this.scene.pushMatrix();
            this.scene.translate(0, 0.2, 0);
            this.piece_wave1.display();
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.piece_wave1.display();
        this.scene.popMatrix();  
        this.scene.pushMatrix();
            this.scene.translate(0, 0.28, 0);
            this.body.display();
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.body.display();
        this.scene.popMatrix(); 
        this.scene.pushMatrix();
            this.scene.translate(0, 1.78, 0);
            this.piece_wave2.display();
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.piece_wave2.display();
        this.scene.popMatrix();  
        this.scene.pushMatrix();
            this.scene.translate(0, 1.86, 0);
            this.piece_wave3.display();
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.piece_wave3.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(0, 1.92, 0);
            this.head.display();
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.head.display();
        this.scene.popMatrix();  
        this.scene.pushMatrix();
            this.scene.translate(0, 2.52, 0);
            this.head_top.display();
        this.scene.popMatrix();  
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(0.6, 0.6, 1);
            this.bottom.display();
        this.scene.popMatrix();  
    }
    
    createPieceBase() {
        let base_radius = 0.6;
        let base_height = 0.2;

		const control_vertexes = 
		[	// U0
            [				 
                [-base_radius, 0.0, 0.0, 1.0 ],        // V0
                [-base_radius*0.6, base_height*6/10, 0.0, 1.0 ],        // V1
                [-base_radius*3/4, base_height, 0.0, 1.0 ]       // V2
            ],
            // U1
            [
                [-base_radius, 0.0, base_radius*4/3, 1.0 ],   // V0
                [-base_radius*0.6, base_height*6/10, base_radius*0.6*4/3, 1.0 ],   // V1
		        [-base_radius*3/4, base_height, base_radius*3/4*4/3, 1.0 ]   // V2					 
            ],
            // U2
            [			
                [ base_radius, 0.0, base_radius*4/3, 1.0 ],   // V0
                [ base_radius*0.6, base_height*6/10, base_radius*0.6*4/3, 1.0 ],   // V1
                [ base_radius*3/4, base_height, base_radius*3/4*4/3, 1.0 ]	// V2	
            ],
            // U3
            [			
                [ base_radius, 0.0, 0.0, 1.0 ],        // V0
                [ base_radius*0.6, base_height*6/10, 0.0, 1.0 ],        // V1
                [ base_radius*3/4, base_height, 0.0, 1.0 ]       // V2
            ]
        ];
        
		this.piece_base = this.createNurbsObject(3, 2, control_vertexes, 40, 20);
    }

    createPieceWave1() {
        let height = 0.08;
        let width = 0.45;
		const control_vertexes = 
		[	// U0
            [				 
                [-width, 0.0, 0.0, 1.0 ],        // V0
                [-width*13/10, height/2, 0.0, 1.0 ],        // V0
                [-width, height, 0.0, 1.0 ]       // V1
            ],
            // U1
            [
                [-width, 0.0, width*4/3, 1.0 ],   // V0
                [-width*13/10, height/2, width*13/10*4/3, 1.0 ],   // V0
                [-width, height, width*4/3, 1.0 ]	// V1					 
            ],
            // U2
            [			
                [ width, 0.0, width*4/3, 1.0 ],   // V0
                [ width*13/10, height/2, width*13/10*4/3, 1.0 ],   // V0
				[ width, height, width*4/3, 1.0 ]   // V1
            ],
            // U3
            [			
                [ width, 0.0, 0.0, 1.0 ],        // V0
                [ width*13/10, height/2, 0.0, 1.0 ],        // V0
                [ width, height, 0.0, 1.0 ]       // V1
            ]
		];
        
		this.piece_wave1 = this.createNurbsObject(3, 2, control_vertexes, 20, 20);
    }
    
    createBody() {
        let base_radius = 0.45;
        let base_height = 1.5;

		const control_vertexes = 
		[	// U0
            [				 
                [-base_radius, 0.0, 0.0, 1.0 ],        // V0
                [-base_radius*0.6, base_height/5, 0.0, 4.0 ],        // V1
                [-base_radius*1/3, base_height, 0.0, 1.0 ]       // V2
            ],
            // U1
            [
                [-base_radius, 0.0, base_radius*4/3, 1.0 ],   // V0
                [-base_radius*0.6, base_height/5, base_radius*0.6*4/3, 4.0 ],   // V1
		        [-base_radius*1/3, base_height, base_radius*1/3*4/3, 1.0 ]   // V2					 
            ],
            // U2
            [			
                [ base_radius, 0.0, base_radius*4/3, 1.0 ],   // V0
                [ base_radius*0.6, base_height/5, base_radius*0.6*4/3, 4.0 ],   // V1
                [ base_radius*1/3, base_height, base_radius*1/3*4/3, 1.0 ]	// V2	
            ],
            // U3
            [			
                [ base_radius, 0.0, 0.0, 1.0 ],        // V0
                [ base_radius*0.6, base_height/5, 0.0, 4.0 ],        // V1
                [ base_radius*1/3, base_height, 0.0, 1.0 ]       // V2
            ]
        ];
        
		this.body = this.createNurbsObject(3, 2, control_vertexes, 20, 20);
    }

    createPieceWave2() {
        let height = 0.08;
        let width = 0.15;
		const control_vertexes = 
		[	// U0
            [				 
                [-width, 0.0, 0.0, 1.0 ],        // V0
                [-width*7/4, height/2, 0.0, 1.0 ],        // V0
                [-width, height, 0.0, 1.0 ]       // V1
            ],
            // U1
            [
                [-width, 0.0, width*4/3, 1.0 ],   // V0
                [-width*7/4, height/2, width*7/4*4/3, 1.0 ],   // V0
                [-width, height, width*4/3, 1.0 ]	// V1					 
            ],
            // U2
            [			
                [ width, 0.0, width*4/3, 1.0 ],   // V0
                [ width*7/4, height/2, width*7/4*4/3, 1.0 ],   // V0
				[ width, height, width*4/3, 1.0 ]   // V1
            ],
            // U3
            [			
                [ width, 0.0, 0.0, 1.0 ],        // V0
                [ width*7/4, height/2, 0.0, 1.0 ],        // V0
                [ width, height, 0.0, 1.0 ]       // V1
            ]
		];
        
		this.piece_wave2 = this.createNurbsObject(3, 2, control_vertexes, 20, 20);
    }

    createPieceWave3() {
        let height = 0.06;
        let width = 0.15;
		const control_vertexes = 
		[	// U0
            [				 
                [-width, 0.0, 0.0, 1.0 ],        // V0
                [-width*5/4, height/2, 0.0, 1.0 ],        // V0
                [-width, height, 0.0, 1.0 ]       // V1
            ],
            // U1
            [
                [-width, 0.0, width*4/3, 1.0 ],   // V0
                [-width*5/4, height/2, width*5/4*4/3, 1.0 ],   // V0
                [-width, height, width*4/3, 1.0 ]	// V1					 
            ],
            // U2
            [			
                [ width, 0.0, width*4/3, 1.0 ],   // V0
                [ width*5/4, height/2, width*5/4*4/3, 1.0 ],   // V0
				[ width, height, width*4/3, 1.0 ]   // V1
            ],
            // U3
            [			
                [ width, 0.0, 0.0, 1.0 ],        // V0
                [ width*5/4, height/2, 0.0, 1.0 ],        // V0
                [ width, height, 0.0, 1.0 ]       // V1
            ]
		];
        
		this.piece_wave3 = this.createNurbsObject(3, 2, control_vertexes, 20, 20);
    }

    createHead() {
        let height = 0.55;
        let width_base = 0.15;
        let width = width_base * 1.7;
		const control_vertexes = 
		[	// U0
            [				 
                [-width_base, 0.0, 0.0, 1.0 ],        // V0
                [-width*3/2, height*1/5, 0.0, 1.0 ],        // V0
                [-width, height*2/5, 0.0, 4.0 ],       // V1
                [-width*1/5, height, 0.0, 1.0 ]       // V1
            ],
            // U1
            [
                [-width_base, 0.0, width_base*4/3, 1.0 ],   // V0
                [-width*3/2, height*1/5, width*3/2*4/3, 1.0 ],   // V0
                [-width, height*2/5, width*4/3, 4.0 ],	// V1			
                [-width*1/5, height, width*1/5*4/3, 1.0 ]	// V1					 
            ],
            // U2
            [			
                [ width_base, 0.0, width_base*4/3, 1.0 ],   // V0
                [ width*3/2, height*1/5, width*3/2*4/3, 1.0 ],   // V0
				[ width, height*2/5, width*4/3, 4.0 ],   // V1
				[ width*1/5, height, width*1/5*4/3, 1.0 ]   // V1
            ],
            // U3
            [			
                [ width_base, 0.0, 0.0, 1.0 ],        // V0
                [ width*3/2, height*1/5, 0.0, 1.0 ],        // V0
                [ width, height*2/5, 0.0, 4.0 ],       // V1
                [ width*1/5, height, 0.0, 1.0 ]       // V1
            ]
		];
        
		this.head = this.createNurbsObject(3, 3, control_vertexes, 20, 20);
		this.head_top = new Sphere(this.scene, 20, 20, 0.075);
    }

    createBottom() {
        this.bottom = new Circle(this.scene, 40);
    }
};