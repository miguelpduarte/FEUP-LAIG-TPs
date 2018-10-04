class Component extends CGFobject {
	constructor(scene, component_model, transformation_factory) {
        super(scene);

        this.precomputeTransformationMatrix(component_model, transformation_factory);
        this.getMaterials(component_model);
        this.getTexture(component_model);
    };
    
    precomputeTransformationMatrix(component_model, transformation_factory) {
        //Calculates the transformation matrix based on the component model
        //(precomputed transformations referenced and "hardcoded" inline transformations)
        if(component_model.transformationref) {
            this.transformation_matrix = this.scene.transformations.get(component_model.transformationref);
        } else {
            this.transformation_matrix = transformation_factory.create({transformations: component_model.explicitTransformations})
        }
    }

    getMaterials(component_model) {
        this.materials = [];
        for(let materialId of component_model.materialIds) {
            if(materialId === "inherit") {
                this.materials.push("inherit");
            } else {
                this.materials.push(this.scene.materials.get(materialId));
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
        for (let child of this.children) {
            //This is not the correct way (I think) but it is the current solution
            this.scene.pushMatrix();
                this.applyTransformations();
                this.applyTextures();
                this.applyMaterials();

                child.display();
            this.scene.popMatrix();
        }         
    }

    applyTransformations() {
        //Apply precomputed transformations to the scene using this.scene.multMatrix
        this.scene.multMatrix(this.transformation_matrix);
    }

    //THIS IMPLEMENTATION IS TEMPORARY PROBABLY

    applyMaterials() {
        this.materials[0].apply();
    }

    applyTextures() {
        this.materials[0].setTexture(this.texture);
    }
};