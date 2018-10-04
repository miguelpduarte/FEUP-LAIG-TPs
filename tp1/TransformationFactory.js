class TransformationFactory {
    constructor(transformation_scene) {
        this.transformation_scene = transformation_scene;

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
        let transformation = {
            id: transformation_model.id,
        };

        this.transformation_scene.loadIdentity();
        for(let transformation_item of transformation_model) {
            this.TRANSFORMATION_CREATION_FUNCS[transformation_item.type](transformation_item);
        }

        transformation.matrix = this.transformation_scene.getMatrix();

        return transformation;
    }

    createTranslate(tranformation_item_model) {
        this.transformation_scene.translate(tranformation_item_model.x, transformation_item_model.y, tranformation_item_model.z);
    }

    createRotate(tranformation_item_model) {
        switch(this.transformation_scene.angle) {
            case "x":
                this.transformation_scene.rotate(tranformation_item_model.angle, 1, 0, 0);
                break;
            case "y":
                this.transformation_scene.rotate(tranformation_item_model.angle, 0, 1, 0);
                break;
            case "z":
                this.transformation_scene.rotate(tranformation_item_model.angle, 0, 0, 1);
                break;
        }
    }

    createScale(tranformation_item_model) {
        this.transformation_scene.scale(tranformation_item_model.x, transformation_item_model.y, tranformation_item_model.z);
    }
}