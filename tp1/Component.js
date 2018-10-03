class Component extends CGFobject {
	constructor(scene, component_model, dummy_scene) {
        super(scene);

        this.precomputeTransformationMatrix(component_model, dummy_scene);
        this.getMaterials(component_model);
        this.getTexture(component_model);
    };
    
    precomputeTransformationMatrix(component_model, dummy_scene) {
        //Calculates the transformation matrix based on the component model
        //(precomputed transformations referenced and "hardcoded" inline transformations)
    }

    getMaterials(component_model) {
        this.materials = [];
        for(let materialId of component_model.materialIds) {
            if(materialId === "inherit") {
                this.materials.push("inherit");
            } else {
                this.materials.push(this.scene.materials.get());
            }
        }
    }

    getTexture(component_model) {
        console.warn("Texture length attributes not being used for now");
        if(component_model.texture.id === "none" || component_model.texture.id === "inherit") {
            this.texture = component_model.texture.id;
        } else {
            this.texture = this.scene.textures.get(component_model.texture.id);
        }
    }

    setChildren(children_arr) {
        this.children = children_arr;
    }

	display() {
        this.scene.pushMatrix();
            this.applyTransformations();
            this.applyMaterials();
            this.applyTextures();
            for (let child of this.children) {
                child.display();
            }         
        this.scene.popMatrix();     
    }

    applyTransformations() {
        //Apply precomputed transformations to the scene using this.scene.multMatrix
        // this.scene.multMatrix(this.transformation_mat);
    }

    applyMaterials() {

    }

    applyTextures() {
        
    }
};