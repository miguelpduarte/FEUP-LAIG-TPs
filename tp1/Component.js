class Component extends CGFobject {
	constructor(scene, component_model, transformation_factory) {
        super(scene);

        this.precomputeTransformationMatrix(component_model, transformation_factory);
        this.getMaterials(component_model);
        this.getTexture(component_model);

        this.currentMaterialIndex = 0;
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

    rotateMaterial() {
        //Cycles to the next material, if it exists
        //Called when the user presses 'M'
        // this.currentMaterialIndex = (this.currentMaterialIndex + 1) % this.materials.length;
    }

	display() {
        this.scene.pushMatrix();
        this.applyTransformations();
        this.pushMaterials();
        this.pushTextures();
        this.applyAppearance();

        for (let child of this.children) {
                child.display();
        }    

        this.scene.popMatrix();    
        this.scene.materialStack.pop();
        this.scene.textureStack.pop();
    }

    

    applyTransformations() {
        //Apply precomputed transformations to the scene using this.scene.multMatrix
        this.scene.multMatrix(this.transformation_matrix);
    }

    applyAppearance() {
        this.scene.materialStack[this.scene.materialStack.length - 1].apply();
    }

    pushMaterials() {
        if (this.materials[this.currentMaterialIndex] === "inherit") {
            this.scene.materialStack.push(this.scene.materialStack[this.scene.materialStack.length - 1]);
        }
        else {
            this.scene.materialStack.push(this.materials[this.currentMaterialIndex]);
        }
    }

    pushTextures() {
        if (this.texture === "inherit") {
            this.scene.textureStack.push(this.scene.textureStack[this.scene.textureStack.length - 1]);
        } 
        else if (this.texture === "none") {
            this.scene.textureStack.push(null);
        } 
        else {
            this.scene.textureStack.push(this.texture);
        }

        this.scene.materialStack[this.scene.materialStack.length - 1].setTexture(
            this.scene.textureStack[this.scene.textureStack.length - 1]
        );
    }
};