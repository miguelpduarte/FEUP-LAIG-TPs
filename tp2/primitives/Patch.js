/**
 * Plane
 * @constructor
 */
class Plane extends PrimitiveObject {
	constructor(scene, plane_model, createNurbsObject) {
		super(scene);

		const control_vertexes = 
		[	// U0
			[
				[0.5, 0.0, -0.5, 1],	// V0
				[0.5, 0.0,  0.5, 1]		// V1
			],

			//U1
			[
				[-0.5, 0.0, -0.5, 1],	// V0
				[-0.5, 0.0,  0.5, 1]	// V1
			]
		];

		this.nurbs_object = createNurbsObject(1, 1, control_vertexes, plane_model.npartsU, plane_model.npartsV);
	};

	display() {
		this.nurbs_object.display();
	}
};