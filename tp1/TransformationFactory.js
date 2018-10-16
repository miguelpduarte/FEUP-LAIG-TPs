// const DEGREE_TO_RAD = Math.PI / 180;

class TransformationFactory {
    constructor() {
        this.TRANSFORMATION_CREATION_FUNCS = {
            "translate": this.createTranslate,
            "rotate": this.createRotate,
            "scale": this.createScale
        };

        //Binding this
        Object.keys(this.TRANSFORMATION_CREATION_FUNCS)
            .forEach(key => this.TRANSFORMATION_CREATION_FUNCS[key] = this.TRANSFORMATION_CREATION_FUNCS[key].bind(this));
    }

    create(transformation_model) {
        this.mat = mat4.create();

        for(let transformation_item of transformation_model.transformations) {
            this.TRANSFORMATION_CREATION_FUNCS[transformation_item.type](transformation_item);
        }

        //Returns the computed transformation matrix
        return this.mat;
    }

    createTranslate(transformation_item_model) {
        mat4.translate(this.mat, this.mat, vec3.fromValues(transformation_item_model.x, transformation_item_model.y, transformation_item_model.z));
    }

    createRotate(transformation_item_model) {
        const angle = DEGREE_TO_RAD * transformation_item_model.angle;

        switch(transformation_item_model.axis) {
            case "x":
                mat4.rotateX(this.mat, this.mat, angle);
                break;
            case "y":
                mat4.rotateY(this.mat, this.mat, angle);
                break;
            case "z":
                mat4.rotateZ(this.mat, this.mat, angle);
                break;
        }
    }

    createScale(transformation_item_model) {
        mat4.scale(this.mat, this.mat, vec3.fromValues(transformation_item_model.x, transformation_item_model.y, transformation_item_model.z));
    }
}