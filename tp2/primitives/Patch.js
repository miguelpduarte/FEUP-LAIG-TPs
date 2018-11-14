/**
 * Patch
 * @constructor
 */
class Patch extends PrimitiveObject {
	constructor(scene, patch_model, createNurbsObject) {
		super(scene);
		
		console.log(patch_model);
	};

	display() {
		//this.nurbs_object.display();
	}
};