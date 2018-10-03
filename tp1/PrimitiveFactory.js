class PrimitiveFactory {
    //Used simply because static data members are not a thing yet, it seems
    constructor(scene) {
        this.PRIMITIVE_CREATION_FUNCS = {
            "rectangle": this.createRectangle,
            "triangle": this.createTriangle,
            "cylinder": this.createCylinder,
            "sphere": this.createSphere,
            "torus": this.createTorus
        }

        //Binding this
        Object.keys(this.PRIMITIVE_CREATION_FUNCS)
            .forEach(key => this.PRIMITIVE_CREATION_FUNCS[key] = this.PRIMITIVE_CREATION_FUNCS[key].bind(this));

        this.scene = scene;
    }

    create(primitive_model) {
        return this.PRIMITIVE_CREATION_FUNCS[primitive_model.type](primitive_model);
    }

    createRectangle(rectangle_model) {
        return new Rectangle(this.scene, 
            rectangle_model.x1, rectangle_model.y1, 
            rectangle_model.x2, rectangle_model.y2
        ); 
    }

    createSphere(sphere_model) {
        return new Sphere(this.scene, 
            sphere_model.slices, 
            sphere_model.stacks, 
            sphere_model.radius
        );
    }

    createTriangle(triangle_model) {
        return new Triangle(this.scene, 
            triangle_model.x1, triangle_model.y1, triangle_model.z1, 
            triangle_model.x2, triangle_model.y2, triangle_model.z2, 
            triangle_model.x3, triangle_model.y3, triangle_model.z3
        );
    }

    createCylinder(cylinder_model) {
        return new Cylinder(this.scene, 
            cylinder_model.slices, 
            cylinder_model.stacks,
            cylinder_model.height,
            cylinder_model.base,
            cylinder_model.top
        );
    }

    createTorus(torus_model) {
        return new Torus(this.scene, 
            torus_model.inner, 
            torus_model.outer, 
            torus_model.slices, 
            torus_model.loops
        );
    }
};