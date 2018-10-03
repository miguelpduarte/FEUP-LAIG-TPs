class Component extends CGFobject {
	constructor(scene, componentModel) {
        super(scene);
		this.initBuffers(x1, y1, x2, y2);
	};

    setChildren(children_arr) {
        this.children = children_arr;
    }

	display() {
        this.scene.pushMatrix();
            this.applyTransformations();
            for (let child of this.children) {
                child.display();
            }         
        this.scene.popMatrix();     
    }

    applyTransformations() {

    }
};