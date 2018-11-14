/**
 * Patch
 * @constructor
 */
class Patch extends PrimitiveObject {
	constructor(scene, patch_model, createNurbsObject) {
		super(scene);
		
		const {
			npartsU, npartsV, npointsU, npointsV, controlPoints
		} = patch_model;

		let control_vertexes = [];

		for (let i = 0; i < npointsU; i++) {
			// U point number i
			let upoints = [];
			for (let j = 0; j < npointsV; j++) {
				// V points number j
				let point = Object.values(controlPoints[i*npointsV + j]);
				point.push(1);	// control points have w = 1
				upoints.push(point);
			}
			control_vertexes.push(upoints);
		}

		
		this.nurbs_object = createNurbsObject(npointsU - 1, npointsV - 1, control_vertexes, npartsU, npartsV);
	};

	display() {
		this.nurbs_object.display();
	}
};