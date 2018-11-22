class PrimitiveFactory {
    //Used simply because static data members are not a thing yet, it seems
    constructor(scene) {
        this.PRIMITIVE_CREATION_FUNCS = {
            "rectangle": this.createRectangle,
            "triangle": this.createTriangle,
            "cylinder": this.createCylinder,
            "cylinder2": this.createCylinder2,
            "sphere": this.createSphere,
            "torus": this.createTorus,
            "plane": this.createPlane,
            "patch": this.createPatch,
            "vehicle": this.createVehicle,
            "terrain": this.createTerrain,
            "water": this.createWater
        };

        //Binding this
        Object.keys(this.PRIMITIVE_CREATION_FUNCS)
            .forEach(key => this.PRIMITIVE_CREATION_FUNCS[key] = this.PRIMITIVE_CREATION_FUNCS[key].bind(this));

        this.createNurbsObject = this.createNurbsObject.bind(this);
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

    createCylinder2(cylinder2_model) {
        return new Cylinder2(this.scene, cylinder2_model, this.createNurbsObject);
    }

    createTorus(torus_model) {
        return new Torus(this.scene, 
            torus_model.inner, 
            torus_model.outer, 
            torus_model.slices, 
            torus_model.loops
        );
    }

    createPlane(plane_model) {
        return new Plane(this.scene, plane_model, this.createNurbsObject);
    }

    createPatch(patch_model) {
        return new Patch(this.scene, patch_model, this.createNurbsObject);
    }

    createVehicle(vehicle_model) {
        console.log(vehicle_model);
    }

    createTerrain(terrain_model) {
        return new Terrain(this.scene, terrain_model, this.createNurbsObject);
    }

    createWater(water_model) {
        console.log(water_model);
    }

    createNurbsObject(degree_u, degree_v, control_vertexes, divs_u, divs_v) {
        let nurbs_surface = new CGFnurbsSurface(degree_u, degree_v, control_vertexes);

        return new CGFnurbsObject(this.scene, divs_u, divs_v, nurbs_surface);
    }
};