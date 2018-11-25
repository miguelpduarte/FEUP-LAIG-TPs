class Component extends CGFobject {
	constructor(scene, component_model, transformation_factory) {
        super(scene);

        this.length_s = component_model.texture.length_s;
        this.length_t = component_model.texture.length_t;
        this.hasOwnTexCoords = (this.length_s !== undefined && this.length_t !== undefined);

        this.precomputeTransformationMatrix(component_model, transformation_factory);
        this.getMaterials(component_model);
        this.getTexture(component_model);
        this.getAnimations(component_model);

        this.currentMaterialIndex = 0;
        this.currentAnimationIndex = 0;
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
        for(const materialId of component_model.materialIds) {
            if(materialId === "inherit") {
                this.materials.push("inherit");
            } else {
                this.materials.push(this.scene.materials.get(materialId));
            }
        }
    }

    getTexture(component_model) {
        if(component_model.texture.id === "none" || component_model.texture.id === "inherit") {
            this.texture = component_model.texture.id;
        } else {
            this.texture = this.scene.textures.get(component_model.texture.id);
        }
    }

    getAnimations(component_model) {
        this.animations = [];
        for (const animationId of component_model.animationIds) {
            let animation_model = this.scene.graph.animations.get(animationId);

            if(animation_model.type === "linear") {
                const animation = new LinearAnimation(animation_model.controlPoints, animation_model.span);
                this.animations.push(animation);
            } else if (animation_model.type === "circular") {
                const animation = new CircularAnimation(animation_model.center, animation_model.radius, animation_model.startang, animation_model.rotang, animation_model.span);
                this.animations.push(animation);
            }
        }       
    }

    setChildren(children_arr) {
        this.children = children_arr;
    }

    rotateMaterial() {
        //Cycles to the next material, if it exists
        //Called when the user presses 'M'
        this.currentMaterialIndex = (this.currentMaterialIndex + 1) % this.materials.length;

        for(const child of this.children) {
            if(child instanceof Component) {
                child.rotateMaterial();
            }
        }
    }

    updateAnimations(delta_time) {
        if (this.currentAnimationIndex >= this.animations.length) {
            return;
        }

        let remaining_time;
        do {
            remaining_time = this.animations[this.currentAnimationIndex].update(delta_time);
            if(remaining_time > 0 ) {
                this.currentAnimationIndex++;

                if (this.currentAnimationIndex >= this.animations.length) {
                    return;
                }
            }
        } while(remaining_time > 0);
    }

    resetAnimations() {
        this.currentAnimationIndex = 0;

        for (let animation of this.animations) {
            animation.reset();
        }
    }

	display() {
        this.scene.pushMatrix();
        this.applyTransformations();
        this.applyAnimation();
        this.pushMaterials();
        this.pushTextures();
        this.applyAppearance();

        for (let child of this.children) {
            if(child instanceof PrimitiveObject || child.texture === "inherit") {
                child.setTexLengths(this.length_s, this.length_t);
            }
            child.display();
        }

        this.scene.popMatrix();    
        this.scene.materialStack.pop();
        this.scene.textureStack.pop();
    }

    setTexLengths(length_s, length_t) {
        if (!this.hasOwnTexCoords) {
            this.length_s = length_s;
            this.length_t = length_t;
        }
    }

    applyTransformations() {
        //Apply precomputed transformations to the scene using this.scene.multMatrix
        this.scene.multMatrix(this.transformation_matrix);
    }

    applyAnimation() {
        if (this.currentAnimationIndex < this.animations.length) {
            this.animations[this.currentAnimationIndex].apply(this.scene);
        }
    }

    applyAppearance() {
        this.scene.materialStack[this.scene.materialStack.length - 1].setTexture(
            this.scene.textureStack[this.scene.textureStack.length - 1]
        );

        this.scene.materialStack[this.scene.materialStack.length - 1].apply();
    }

    pushMaterials() {
        if (this.materials[this.currentMaterialIndex] === "inherit") {
            this.scene.materialStack.push(this.scene.materialStack[this.scene.materialStack.length - 1]);
        } else {
            this.scene.materialStack.push(this.materials[this.currentMaterialIndex]);
        }
    }

    pushTextures() {
        if (this.texture === "inherit") {
            this.scene.textureStack.push(this.scene.textureStack[this.scene.textureStack.length - 1]);
        } else if (this.texture === "none") {
            this.scene.textureStack.push(null);
        } else {
            this.scene.textureStack.push(this.texture);
        }
    }
};