const XML_NODES = [
    'scene',
    'views',
    'ambient',
    'lights',
    'textures',
    'materials',
    'transformations',
    'animations',
    'primitives',
    'components'
]

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.rootElementId = null;
        this.ambient = null;
        this.background = null;

        //To use for checking if ids are repeated
        this.cameras = new Map();
        this.lights = new Map();
        this.textures = new Map();
        this.materials = new Map();
        this.transformations = new Map();
        this.animations = new Map();
        this.primitives = new Map();
        this.components = new Map();

        this.requestedChildComponentIds = new Set();
        this.tree = {};

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        //Defining parsing helpers
        this.XML_ELEMENTS_PARSING_FUNCS = {
            'scene': this.parseScene,
            'views': this.parseViews,
            'ambient': this.parseAmbient,
            'lights': this.parseLights,
            'textures': this.parseTextures,
            'materials': this.parseMaterials,
            'transformations': this.parseTransformations,
            'animations': this.parseAnimations,
            'primitives': this.parsePrimitives,
            'components': this.parseComponents
        }

        //Binding this
        Object.keys(this.XML_ELEMENTS_PARSING_FUNCS)
            .forEach(key => this.XML_ELEMENTS_PARSING_FUNCS[key] = this.XML_ELEMENTS_PARSING_FUNCS[key].bind(this));

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        const rootElement = this.reader.xmlDoc.documentElement;

        try {
            // Here should go the calls for different functions to parse the various blocks
            const legacy_ret = this.parseXMLFile(rootElement);
            if(legacy_ret) {
                console.warn("Some parsing function attempted to return an error, this is legacy behaviour and will no longer be supported, please use exceptions instead");
                console.error("Legacy Error: ", legacy_ret);
            }
        } catch (error) {
            if (error) {
                this.onXMLError(error);
                return;
            }
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName !== "yas") {
            throw "root tag <yas> missing";
        }

        const nodes = rootElement.children;

        //Checking elements order
        for(let i = 0; i < XML_NODES.length; ++i) {
            if(nodes[i].nodeName !== XML_NODES[i]) {
                throw "node " + XML_NODES[i] + " missing or out of order!";
            }
        }

        if(nodes.length > XML_NODES.length) {
            this.onXMLMinorError("The XML File has additional unexpected nodes. These were not parsed.");
        }

        for(let i = 0; i < XML_NODES.length; ++i) {
            this.XML_ELEMENTS_PARSING_FUNCS[XML_NODES[i]](nodes[i]);
        }
    }

    /**
     * Parses the <scene> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {
        this.rootElementId = this.parseStringAttr(sceneNode, "root");
        this.referentialLength = this.parseFloatAttr(sceneNode, "axis_length");
    }

    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {
        this.defaultViewId = this.parseStringAttr(viewsNode, "default");

        const views = viewsNode.children;
        
        for(let i = 0; i < views.length; ++i) {
            if(views[i].nodeName === "perspective") {
                this.createPerspectiveCamera(views[i]);
            } else if(views[i].nodeName === "ortho") {
                this.createOrthoCamera(views[i]);
            }
        }
        
        //Check if it has one view defined at least and it matches the default view id
        if(this.cameras.size === 0) {
            throw "no views were defined";
        }

        if(!this.cameras.has(this.defaultViewId)) {
            throw "specified default view id does not exist";
        }
    }

    createPerspectiveCamera(viewNode) {
        const id = this.parseStringAttr(viewNode, "id");

        //parseFloatAttr throws if attr is NaN

        const near = this.parseFloatAttr(viewNode, "near");
        const far = this.parseFloatAttr(viewNode, "far");

        //near must be smaller than far
        if (near >= far) {
            throw `perspective camera with id '${id}': near attribute must be smaller than far attribute`;
        }

        let angle = this.parseFloatAttr(viewNode, "angle");

        if (angle <= 0) {
            this.onXMLMinorError(`perspective camera with id '${id}': camera angle should be bigger than 0º, setting angle to 0.1º`);
            angle = 0.1;
        } else if (angle > 180) {
            this.onXMLMinorError(`perspective camera with id '${id}': camera angle should be smaller or equal to 180º, setting angle to 180º`);
            angle = 180;
        }

        const cameraCoords = viewNode.children;

        if (cameraCoords.length !== 2) {
            throw "perspective '" + id + "' invalid number of camera coordinates";
        } else if (cameraCoords[0].nodeName !== "from") {
            throw this.missingNodeMessage("perspective", "from");
        } else if (cameraCoords[1].nodeName !== "to") {
            throw this.missingNodeMessage("perspective", "to");
        }

        //parseCoords throws if coords are not valid

        const from = this.parseCoords(cameraCoords[0]);
        const to = this.parseCoords(cameraCoords[1]);

        if (from.x === to.x && from.y === to.y && from.z === to.z) {
            throw `perspective camera with id '${id}': 'from' and 'to' attributes cannot be the same point in space`;
        }

        const cam = {
            type: "perspective",
            id,
            near,
            far,
            angle,
            from,
            to
        }

        //Throws if id not unique
        this.verifyUniqueId("perspective", this.cameras, id);

        this.cameras.set(cam.id, cam);
    }

    createOrthoCamera(viewNode) {
        const id = this.parseStringAttr(viewNode, "id");

        const near = this.parseFloatAttr(viewNode, "near");
        const far = this.parseFloatAttr(viewNode, "far");

        //near must be smaller than far
        if (near >= far) {
            throw `ortho camera with id '${id}': near attribute must be smaller than far attribute`;
        }

        const left = this.parseFloatAttr(viewNode, "left");
        const right = this.parseFloatAttr(viewNode, "right");
        
        if(left >= right) {
            throw `left is larger than or equal to right for ortho camera with id '${id}'`;
        }
        
        const bottom = this.parseFloatAttr(viewNode, "bottom");
        const top = this.parseFloatAttr(viewNode, "top");
        
        if(bottom >= top) {
            throw `bottom is larger than or equal to top for ortho camera with id '${id}'`;
        }

        const cameraCoords = viewNode.children;

        if (cameraCoords.length !== 2) {
            throw "perspective '" + id + "' invalid number of camera coordinates";
        } else if (cameraCoords[0].nodeName !== "from") {
            throw this.missingNodeMessage("perspective", "from");
        } else if (cameraCoords[1].nodeName !== "to") {
            throw this.missingNodeMessage("perspective", "to");
        }

        //parseCoords throws if coords are not valid

        const from = this.parseCoords(cameraCoords[0]);
        const to = this.parseCoords(cameraCoords[1]);

        if (from.x === to.x && from.y === to.y && from.z === to.z) {
            throw `ortho camera with id '${id}': 'from' and 'to' attributes cannot be the same point in space`;
        }

        const cam = {
            type: "ortho",
            id,
            near,
            far,
            left,
            right,
            bottom,
            top,
            from,
            to
        }

        this.verifyUniqueId("ortho", this.cameras, id);

        this.cameras.set(cam.id, cam);
    }

    parseAmbient(ambientNode) {
        const children = ambientNode.children;

        if (children.length !== 2) {
            throw "ambient invalid number of child nodes";
        } else if (children[0].nodeName !== "ambient") {
            throw this.missingNodeMessage("ambient", "ambient");
        } else if (children[1].nodeName !== "background") {
            throw this.missingNodeMessage("ambient", "background");
        }

        //parseRGBA throws if not valid
        this.ambient = this.parseRGBA(children[0]);
        this.background = this.parseRGBA(children[1]);
    }

    parseLights(lightsNode) {
        const lights = lightsNode.children;

        for(let i = 0; i < lights.length; ++i) {
            if(lights[i].nodeName === "omni") {
                this.createOmniLight(lights[i]);
            } else if(lights[i].nodeName === "spot") {
                this.createSpotLight(lights[i]);
            }
        }

        if (this.lights.size === 0) {
            throw "no lights were defined";
        } else if (this.lights.size > 8) {
            this.onXMLMinorError("CGF Scenes only support 8 lights. The remaining lights will be ignored.");
        }
    }

    createOmniLight(lightNode) {
        const id = this.parseStringAttr(lightNode, "id");

        //enabled
        if(!this.reader.hasAttribute(lightNode, "enabled")) {
            throw this.missingNodeAttributeMessage("omni", "enabled");
        }

        const enabled = this.reader.getBoolean(lightNode, "enabled");
        if (enabled === null) {
            throw this.notBooleanAttributeMessage(lightNode.nodeName, "enabled");
        }

        const lightProperties = lightNode.children;

        if (lightProperties.length !== 4) {
            throw "omni '" + id + "' invalid number of light coordinates";
        } else if (lightProperties[0].nodeName !== "location") {
            throw this.missingNodeMessage("omni", "location");
        } else if (lightProperties[1].nodeName !== "ambient") {
            throw this.missingNodeMessage("omni", "ambient");
        } else if (lightProperties[2].nodeName !== "diffuse") {
            throw this.missingNodeMessage("omni", "diffuse");
        } else if (lightProperties[3].nodeName !== "specular") {
            throw this.missingNodeMessage("omni", "specular");
        }

        let locationNode = lightProperties[0]
        let location = this.parseCoords(locationNode);
        let w = this.parseFloatAttr(locationNode, "w");
        location.w = w;

        let ambient = this.parseRGBA(lightProperties[1]);
        let diffuse = this.parseRGBA(lightProperties[2]);
        let specular = this.parseRGBA(lightProperties[3]);

        const light = {
            type: "omni",
            id,
            enabled,
            location,
            ambient,
            diffuse,
            specular
        }

        this.verifyUniqueId("omni", this.lights, id);

        this.lights.set(light.id, light);
    }

    createSpotLight(lightNode) {
        const id = this.parseStringAttr(lightNode, "id");

        if(!this.reader.hasAttribute(lightNode, "enabled")) {
            throw this.missingNodeAttributeMessage("spot", "enabled");
        }
        const enabled = this.reader.getBoolean(lightNode, "enabled");
        if (enabled === null) {
            throw this.notBooleanAttributeMessage(lightNode.nodeName, "enabled");
        }

        let angle = this.parseFloatAttr(lightNode, "angle");

        if (angle <= 0) {
            this.onXMLMinorError(`spot light with id '${id}': light angle should be bigger than 0º, setting angle to 0.1º`);
            angle = 0.1;
        } else if (angle > 180) {
            this.onXMLMinorError(`spot light with id '${id}': light angle should be smaller or equal to 180º, setting angle to 180º`);
            angle = 180;
        }

        let exponent = this.parseFloatAttr(lightNode, "exponent");

        const lightProperties = lightNode.children;

        if (lightProperties.length !== 5) {
            throw "spot '" + id + "' invalid number of light coordinates";
        } else if (lightProperties[0].nodeName !== "location") {
            throw this.missingNodeMessage("spot", "location");
        } else if (lightProperties[1].nodeName !== "target") {
            throw this.missingNodeMessage("spot", "target");
        } else if (lightProperties[2].nodeName !== "ambient") {
            throw this.missingNodeMessage("spot", "ambient");
        } else if (lightProperties[3].nodeName !== "diffuse") {
            throw this.missingNodeMessage("spot", "diffuse");
        } else if (lightProperties[4].nodeName !== "specular") {
            throw this.missingNodeMessage("spot", "specular");
        }

        let locationNode = lightProperties[0]
        let location = this.parseCoords(locationNode);
        let w = this.parseFloatAttr(locationNode, "w");
        location.w = w;

        let target = this.parseCoords(lightProperties[1]);
        let ambient = this.parseRGBA(lightProperties[2]);
        let diffuse = this.parseRGBA(lightProperties[3]);
        let specular = this.parseRGBA(lightProperties[4]);

        const light = {
            type: "spot",
            id,
            enabled,
            location,
            target,
            ambient,
            diffuse,
            specular,
            angle,
            exponent
        }

        this.verifyUniqueId("spot", this.lights, id);

        this.lights.set(light.id, light);
    }

    parseTextures(texturesNode) {
        const textures = texturesNode.children;

        for(let i = 0; i < textures.length; ++i) {
            this.createTexture(textures[i]);
        }

        if(this.textures.size === 0) {
            throw "no textures were defined";
        }
    }

    createTexture(textureNode) {
        const id = this.parseStringAttr(textureNode, "id");
        const file = this.parseStringAttr(textureNode, "file");

        const texture = {
            id,
            file
        }

        //Throws if id is not unique
        this.verifyUniqueId("texture", this.textures, id);

        this.textures.set(texture.id, texture);
    }

    parseMaterials(materialsNode) {
        const materials = materialsNode.children;

        for(let i = 0; i < materials.length; ++i) {
            this.createMaterial(materials[i]);
        }

        if(this.materials.size === 0) {
            throw "no materials were defined";
        }
    }

    createMaterial(materialNode) {
        const id = this.parseStringAttr(materialNode, "id");
        const shininess = this.parseFloatAttr(materialNode, "shininess");

        const materialProperties = materialNode.children;

        if (materialProperties.length !== 4) {
            throw "material '" + id + "' invalid number of material propreties";
        } else if (materialProperties[0].nodeName !== "emission") {
            throw this.missingNodeMessage("material", "emission");
        } else if (materialProperties[1].nodeName !== "ambient") {
            throw this.missingNodeMessage("material", "ambient");
        } else if (materialProperties[2].nodeName !== "diffuse") {
            throw this.missingNodeMessage("material", "diffuse");
        } else if (materialProperties[3].nodeName !== "specular") {
            throw this.missingNodeMessage("material", "specular");
        }

        const emission = this.parseRGBA(materialProperties[0]);
        const ambient = this.parseRGBA(materialProperties[1]);
        const diffuse = this.parseRGBA(materialProperties[2]);
        const specular = this.parseRGBA(materialProperties[3]);

        const material = {
            id,
            shininess,
            emission,
            ambient,
            diffuse,
            specular
        }

        this.verifyUniqueId("material", this.materials, id);

        this.materials.set(material.id, material);
    }

    parseTransformations(transformationsNode) {
        const transformations = transformationsNode.children;

        for(let i = 0; i < transformations.length; ++i) {
            this.parseTransformation(transformations[i]);
        }

        if(this.transformations.size === 0) {
            throw "no transformations were defined";
        }
    }

    parseTransformation(transformationNode) {
        const id = this.parseStringAttr(transformationNode, "id");

        let transformation = {
            id,
            transformations: []
        }

        const transformations = transformationNode.children;

        let ret;
        for(let i = 0; i < transformations.length; ++i) {
            if (transformations[i].nodeName === "translate") {
                ret = this.createTranslate(transformations[i]);
            } else if (transformations[i].nodeName === "rotate") {
                ret = this.createRotate(transformations[i]);
            } else if (transformations[i].nodeName === "scale") {
                ret = this.createScale(transformations[i]);
            } else {
                throw "invalid transformation '" + transformations[i].nodeName + "' in transformation with id '" + id + "'";
            }
            
            transformation.transformations.push(ret);
        }

        if (transformation.transformations.length === 0) {
            throw "transformation with id '" + id + "' is empty";
        }

        this.verifyUniqueId("transformation", this.transformations, id);

        this.transformations.set(transformation.id, transformation);
    }

    createTranslate(transformationNode) {
        let translate = this.parseCoords(transformationNode);
        //Is spread operator in return more elegant?
        translate.type = "translate";

        return translate;
    }

    createRotate(transformationNode) {
        const axis = this.parseStringAttr(transformationNode, "axis");
        
        if (axis !== "x" && axis !== "y" && axis !== "z") {
            throw "rotate transformation with invalid axis (must be 'x', 'y' or 'z')";
        }

        const angle = this.parseFloatAttr(transformationNode, "angle");

        return {
            type: "rotate",
            axis,
            angle
        }
    }

    createScale(transformationNode) {
        let scale = this.parseCoords(transformationNode);
        //Is spread operator in return more elegant?
        scale.type = "scale";

        return scale;
    }


    parseAnimations(animationsNode) {
        const animations = animationsNode.children;

        for(let i = 0; i < animations.length; ++i) {
            this.parseAnimation(animations[i]);
        }
    }

    parseAnimation(animationNode) {
        const id = this.parseStringAttr(animationNode, "id");

        this.verifyUniqueId("animation", this.animations, id);

        let animation;
        if (animationNode.nodeName === "linear") {
            animation = this.createLinearAnimation(animationNode, id);
        } else if (animationNode.nodeName === "circular") {
            animation = this.createCircularAnimation(animationNode, id);
        } else {
            throw `animation '${id}': invalid animation type. Animations may only be 'linear' or 'circular'`;
        }

        animation.id = id;

        this.animations.set(animation.id, animation);
    }

    createLinearAnimation(animationNode, id) {
        const span = this.parseFloatAttr(animationNode, "span");

        const animationChildren = animationNode.children;

        let controlPoints = [];

        for (let controlPointNode of animationChildren) {
            if (controlPointNode.nodeName === "controlpoint") {
                const xx = this.parseFloatAttr(controlPointNode, "xx");
                const yy = this.parseFloatAttr(controlPointNode, "yy");
                const zz = this.parseFloatAttr(controlPointNode, "zz");
                controlPoints.push({xx, yy, zz});
            } else {
                this.onXMLError(`animation '${id}': invalid control point named '${controlPointNode.nodeName}'`);
            }
        }

        if (controlPoints.length < 2) {
            throw `animation '${id}': a linear animation must have, at least, 2 control points'`;
        }

        return {
            type: "linear",
            span,
            controlPoints
        }
    }

    createCircularAnimation(animationNode, id) {
        const span = this.parseFloatAttr(animationNode, "span");
        const radius = this.parseFloatAttr(animationNode, "radius");
        const startang = this.parseFloatAttr(animationNode, "startang");
        const rotang = this.parseFloatAttr(animationNode, "rotang");
        //const center = this.parseCircularAnimationCenter(this.reader.getString(animationNode, 'center'), id);
        const center = this.parseCenter(animationNode, id);

        return {
            type: "circular",
            span,
            radius,
            center,
            startang,
            rotang
        }
    }

    parseCenter(node, id) {
        if(!this.reader.hasAttribute(node, "center")) {
            throw `The circular animation with id '${id}' does not have a center defined`;
        }

        const centerString = this.reader.getString(node, "center");
        const values = centerString.split(' ');

        if (values.length !== 3 || 
            isNaN(values[0]) || values[0] === '' || 
            isNaN(values[1]) || values[1] === '' ||
            isNaN(values[2]) || values[2] === '' ) {
            throw `animation '${id}': a circular animation center must have 3 spacial coordinates, in the format 'xx yy zz'`;
        }

        return {
            xx: parseFloat(values[0]),
            yy: parseFloat(values[1]),
            zz: parseFloat(values[2])
        };
    }

    parsePrimitives(primitivesNode) {
        const primitives = primitivesNode.children;

        for(let i = 0; i < primitives.length; ++i) {
            this.parsePrimitive(primitives[i]);
        }

        if(this.primitives.size === 0) {
            throw "no primitives were defined";
        }
    }

    parsePrimitive(primitiveNode) {
        const id = this.parseStringAttr(primitiveNode, "id");

        this.verifyUniqueId("primitive", this.primitives, id);

        const childNodes = primitiveNode.children;

        if (childNodes.length > 1) {
            throw "primitive with id '" + id + "' has more than one tag";
        } else if (childNodes.length === 0) {
            throw "primitive with id '" + id + "' is empty";
        }

        let primitiveChild = childNodes[0];

        let primitive;
        if (primitiveChild.nodeName === "rectangle") {
            primitive = this.createRectangle(primitiveChild);
        } else if (primitiveChild.nodeName === "triangle") {
            primitive = this.createTriangle(primitiveChild);
        } else if (primitiveChild.nodeName === "cylinder") {
            primitive = this.createCylinder(primitiveChild, id);
        } else if (primitiveChild.nodeName === "cylinder2") {
            primitive = this.createCylinder(primitiveChild, id);
            primitive.type = "cylinder2";
        } else if (primitiveChild.nodeName === "sphere") {
            primitive = this.createSphere(primitiveChild, id);
        } else if (primitiveChild.nodeName === "torus") {
            primitive = this.createTorus(primitiveChild, id);
        } else if (primitiveChild.nodeName === "plane") {
            primitive = this.createPlane(primitiveChild, id);
        } else if (primitiveChild.nodeName === "patch") {
            primitive = this.createPatch(primitiveChild, id);
        } else if (primitiveChild.nodeName === "vehicle") {
            primitive = this.createVehicle();
        } else if (primitiveChild.nodeName === "terrain") {
            primitive = this.createTerrain(primitiveChild, id);
        } else if (primitiveChild.nodeName === "water") {
            primitive = this.createWater(primitiveChild, id);
        } else if (primitiveChild.nodeName === "board") {
            primitive = this.createBoard(primitiveChild, id);
        } else {
            throw "invalid primitive type '" + primitiveChild.nodeName + "' in primitive with id '" + id + "'";
        }

        primitive.id = id;

        this.primitives.set(primitive.id, primitive);
    }

    createRectangle(primitiveNode) {
        const x1 = this.parseFloatAttr(primitiveNode, "x1");
        const y1 = this.parseFloatAttr(primitiveNode, "y1");
        const x2 = this.parseFloatAttr(primitiveNode, "x2");
        const y2 = this.parseFloatAttr(primitiveNode, "y2");

        return {
            type: "rectangle",
            x1, y1,
            x2, y2
        }
    }

    createTriangle(primitiveNode) {
        const x1 = this.parseFloatAttr(primitiveNode, "x1");
        const y1 = this.parseFloatAttr(primitiveNode, "y1");
        const z1 = this.parseFloatAttr(primitiveNode, "z1");
        const x2 = this.parseFloatAttr(primitiveNode, "x2");
        const y2 = this.parseFloatAttr(primitiveNode, "y2");
        const z2 = this.parseFloatAttr(primitiveNode, "z2");
        const x3 = this.parseFloatAttr(primitiveNode, "x3");
        const y3 = this.parseFloatAttr(primitiveNode, "y3");
        const z3 = this.parseFloatAttr(primitiveNode, "z3");

        return {
            type: "triangle",
            x1, y1, z1,
            x2, y2, z2,
            x3, y3, z3
        }
    }

    createCylinder(primitiveNode, id) {
        const base = this.parseFloatAttr(primitiveNode, "base");
        const top = this.parseFloatAttr(primitiveNode, "top");
        const height = this.parseFloatAttr(primitiveNode, "height");
        const slices = this.parseIntAttr(primitiveNode, "slices");
        const stacks = this.parseIntAttr(primitiveNode, "stacks");

        if (height <= 0) {
            throw `cylinder primitive with id '${id}' height must be a positive number`;
        }
        else if (slices < 2) {
            throw `cylinder primitive with id '${id}' must have at least 2 slices`;
        }
        else if (stacks < 2) {
            throw `cylinder primitive with id '${id}' must have at least 2 stacks`;
        }

        return {
            type: "cylinder",
            base,
            top,
            height,
            slices,
            stacks
        }
    }

    createSphere(primitiveNode, id) {
        const radius = this.parseFloatAttr(primitiveNode, "radius");
        const slices = this.parseIntAttr(primitiveNode, "slices");
        const stacks = this.parseIntAttr(primitiveNode, "stacks");

        if (radius <= 0) {
            throw `sphere primitive with id '${id}' radius must be a positive number`;
        }
        else if (slices < 2) {
            throw `sphere primitive with id '${id}' must have at least 2 slices`;
        }
        else if (stacks < 2) {
            throw `sphere primitive with id '${id}' must have at least 2 stacks`;
        }

        return {
            type: "sphere",
            radius,
            slices,
            stacks
        }
    }

    createTorus(primitiveNode, id) {
        const inner = this.parseFloatAttr(primitiveNode, "inner");
        const outer = this.parseFloatAttr(primitiveNode, "outer");
        const slices = this.parseIntAttr(primitiveNode, "slices");
        const loops = this.parseIntAttr(primitiveNode, "loops");

        if (inner <= 0) {
            throw `torus primitive with id '${id}' inner radius must be a positive number`;
        }
        else if (outer <= 0) {
            throw `torus primitive with id '${id}' outer radius must be a positive number`;
        }
        else if (inner >= outer) {
            throw `torus primitive with id '${id}' outer radius must be bigger than the inner radius`;
        }
        else if (slices < 2) {
            throw `torus primitive with id '${id}' must have at least 2 slices`;
        }
        else if (loops < 2) {
            throw `torus primitive with id '${id}' must have at least 2 loops`;
        }

        return {
            type: "torus",
            inner,
            outer,
            slices,
            loops
        }
    }

    createPlane(primitiveNode, id) {
        const npartsU = this.parseIntAttr(primitiveNode, "npartsU");
        const npartsV = this.parseIntAttr(primitiveNode, "npartsV");

        if (npartsU < 1) {
            throw `plane primitive with id '${id}' must have npartsU greater or equal to 1`;
        } else if (npartsV < 1) {
            throw `plane primitive with id '${id}' must have npartsV greater or equal to 1`;
        }

        return {
            type: "plane",
            npartsU,
            npartsV
        }
    }

    createPatch(primitiveNode, id) {
        const npointsU = this.parseIntAttr(primitiveNode, "npointsU");
        const npointsV = this.parseIntAttr(primitiveNode, "npointsV");
        const npartsU = this.parseIntAttr(primitiveNode, "npartsU");
        const npartsV = this.parseIntAttr(primitiveNode, "npartsV");

        if (npointsU < 1) {
            throw `patch primitive with id '${id}' must have 'npointsU' greater or equal to 1`;
        } else if (npointsV < 1) {
            throw `patch primitive with id '${id}' must have 'npointsV' greater or equal to 1`;
        } else if (npartsU < 1) {
            throw `patch primitive with id '${id}' must have 'npartsU' greater or equal to 1`;
        } else if (npartsV < 1) {
            throw `patch primitive with id '${id}' must have 'npartsV' greater or equal to 1`;
        }

        const controlPointsNodes = primitiveNode.children;
        let controlPoints = [];

        for (let controlPointNode of controlPointsNodes) {
            if (controlPointNode.nodeName === "controlpoint") {
                const xx = this.parseFloatAttr(controlPointNode, "xx");
                const yy = this.parseFloatAttr(controlPointNode, "yy");
                const zz = this.parseFloatAttr(controlPointNode, "zz");
                controlPoints.push({xx, yy, zz});
            } else {
                this.onXMLMinorError(`Invalid '${controlPointNode.nodeName}' controlpoint tag in patch with id '${id}'.`);
            }
        }

        let numPoints = npointsU * npointsV;
        if (controlPoints.length !== numPoints) {
            throw `patch primitive with id '${id}' must have exactly ${numPoints} control points`;
        }

        return {
            type: "patch",
            controlPoints,
            npointsU,
            npointsV,
            npartsU,
            npartsV
        }
    }

    createVehicle() {
        return {
            type: "vehicle"
        }
    }

    createTerrain(primitiveNode, id) {
        const idtexture = this.parseStringAttr(primitiveNode, "idtexture"); // TODO
        const idheightmap = this.parseStringAttr(primitiveNode, "idheightmap"); // TODO
        const parts = this.parseIntAttr(primitiveNode, "parts");
        const heightscale = this.parseFloatAttr(primitiveNode, "heightscale");

        this.verifyInheritableId("texture", idtexture, this.textures);
        this.verifyInheritableId("texture", idheightmap, this.textures);

        if (parts < 1) {
            throw `terrain primitive with id '${id}' must have 'parts' greater or equal to 1`;
        }

        return {
            type: "terrain",
            idtexture,
            idheightmap,
            parts,
            heightscale
        }
    }

    createWater(primitiveNode, id) {
        const idtexture = this.parseStringAttr(primitiveNode, "idtexture");
        const idwavemap = this.parseStringAttr(primitiveNode, "idwavemap");
        const parts = this.parseIntAttr(primitiveNode, "parts");
        const heightscale = this.parseFloatAttr(primitiveNode, "heightscale");
        const texscale = this.parseFloatAttr(primitiveNode, "texscale");

        if (parts < 1) {
            throw `water primitive with id '${id}' must have 'parts' greater or equal to 1`;
        }

        return {
            type: "water",
            idtexture,
            idwavemap,
            parts,
            heightscale,
            texscale
        }
    }

    createBoard() {
        return {
            type: "board"
        }
    }

    parseComponents(componentsNode) {
        const components = componentsNode.children;

        //For verification that all the components were defined two data structures will be used:
        //The map that will store the actual components information (and its id)
        // and a set that will store the "requested" component ids of the children
        // in the end, these data structures should only differ by one element (the root component)

        for(let i = 0; i < components.length; ++i) {
            this.createComponent(components[i]);
        }

        if(this.components.size === 0) {
            throw "no components were defined";
        }

        if(!this.components.has(this.rootElementId)) {
            throw `root component with id '${this.rootElementId}' is missing.`;
        }

        this.verifyComponentChildren();
    }

    createComponent(componentNode) {
        const id = this.parseStringAttr(componentNode, "id");

        this.verifyUniqueId("component", this.components, id);

        const componentProperties = componentNode.children;

        let index_shift = 0;

        // Animations existance checking and parsing (if they exist)
        const animations = componentNode.querySelector('animations');
        let animationIds = [];
        if (animations) {
            // Has animation block, changing index shift
            ++index_shift;
            // Parsing animations
            const animations_children = animations.children;
            for (let animation of animations_children) {
                if (animation.nodeName !== "animationref") {
                    this.onXMLMinorError(`Invalid '${animation.nodeName}' animation tag in component animations.`);
                } else {
                    const animationId = this.parseStringAttr(animation, "id");
                    this.verifyInheritableId("animations", animationId, this.animations);
                    animationIds.push(animationId);
                }
            }
        }
         
        if (componentProperties.length !== 4 + index_shift) {
            throw "component '" + id + "' invalid number of component properties";
        } else if (componentProperties[0].nodeName !== "transformation") {
            throw this.missingNodeMessage("component", "transformation");
        } else if (componentProperties[1 + index_shift].nodeName !== "materials") {
            throw this.missingNodeMessage("component", "materials");
        } else if (componentProperties[2 + index_shift].nodeName !== "texture") {
            throw this.missingNodeMessage("component", "texture");
        } else if (componentProperties[3 + index_shift].nodeName !== "children") {
            throw this.missingNodeMessage("component", "children");
        }

        if (componentProperties[3 + index_shift].children.length === 0) {
            throw `component with id '${id}' has no children`;
        }

        //transformations
        const transformations = componentProperties[0].children;
        let explicit_transformation_found = false;
        let transformationref = null;
        let explicitTransformations = [];
        
        for(let transformation of transformations) {
            if(transformation.nodeName === "transformationref") {
                if (explicit_transformation_found) {                    
                    this.onXMLMinorError(`component '${id}': an explicit transformation has already been found, ignoring transformation references.`);
                    continue;
                }

                const transformation_id = this.parseStringAttr(transformation, "id");

                if (!this.transformations.has(transformation_id)) {
                    throw `component '${id}': transformation with id '${transformation_id}' is not defined.`;
                }

                if (transformations.length > 1) {
                    this.onXMLMinorError(`component '${id}': only one transformation reference in allowed in each component. Further references will be ignored.`);
                }

                transformationref = transformation_id;
                break;
            }
            else {                
                let ret;
                if (transformation.nodeName === "translate") {
                    ret = this.createTranslate(transformation);
                } else if (transformation.nodeName === "rotate") {
                    ret = this.createRotate(transformation);
                } else if (transformation.nodeName === "scale") {
                    ret = this.createScale(transformation);
                } else {
                    throw `invalid transformation '${transformation.nodeName}' in component with id '${id}'.`
                }

                explicit_transformation_found = true;
                explicitTransformations.push(ret);
            }
        }

        //materials
        const materials = componentProperties[1 + index_shift].children;
        let materialIds = [];        
        for (let material of materials) {
            if (material.nodeName !== "material") {
                this.onXMLMinorError(`Invalid '${material.nodeName}' material tag in component materials.`);
            } else {
                const matId = this.parseStringAttr(material, "id");
                this.verifyInheritableId("material", matId, this.materials);
                materialIds.push(matId);
            }
        } 

        //texture
        const textureNode = componentProperties[2 + index_shift];
        const texId = this.parseStringAttr(textureNode, "id");
        this.verifyInheritableNoneId("texture", texId, this.textures);
        let length_s, length_t;
        if ((texId === "inherit" && this.reader.hasAttribute(textureNode, "length_s") && this.reader.hasAttribute(textureNode, "length_t")) ||
            (texId !== "inherit" && texId !== "none")) {
            length_s = this.parseFloatAttr(textureNode, "length_s");
            length_t = this.parseFloatAttr(textureNode, "length_t");
        }

        //children
        const children = componentProperties[3 + index_shift].children;
        let primitiveIds = new Set();
        let componentIds = new Set();

        for (let child of children) {
            if (child.nodeName === "componentref") {
                const childId = this.parseStringAttr(child, "id");
                if(childId === id) {
                    throw `component with id '${id}' includes itself in its children`;
                }
                if(componentIds.has(childId)) {
                    this.onXMLMinorError(`component with id '${id}' has a duplicate child component with id '${childId}'. It will be ignored.`);
                } else {
                    componentIds.add(childId);
                    //Registering that the child component id was requested for further validation
                    this.registerRequestedChildComponent(childId);
                }
            } else if (child.nodeName === "primitiveref") {
                const childId = this.parseStringAttr(child, "id");
                if (!this.primitives.has(childId)) {
                    throw `primitive child with id '${childId}' in component with id '${id}' is not defined.`;
                } else {
                    if(primitiveIds.has(childId)) {
                        this.onXMLMinorError(`component with id '${id}' has a duplicate child primitive with id '${childId}'. It will be ignored.`);
                    } else {
                        primitiveIds.add(childId);
                    }
                }
            } else {
                this.onXMLMinorError(`invalid '${child.nodeName}' child tag in component children. It will be ignored.`);
            }
        }
        
        const component = {
            id,
            animationIds,
            texture: {
                id: texId,
                length_s,
                length_t
            },
            materialIds,
            children: {
                primitiveIds,
                componentIds
            },
            transformationref,
            explicitTransformations
        };

        this.components.set(component.id, component);
    }

    parseStringAttr(node, attribute_name) {
        //TODO: Check if empty?
        if(!this.reader.hasAttribute(node, attribute_name)) {
            throw this.missingNodeAttributeMessage(node.nodeName, attribute_name);
        }
        return this.reader.getString(node, attribute_name);
    }

    attrIsNumber(attribute) {
        return !isNaN(attribute);
    }
    
    parseFloatAttr(node, attribute_name) {
        if(!this.reader.hasAttribute(node, attribute_name)) {
            throw this.missingNodeAttributeMessage(node.nodeName, attribute_name);
        }
        let attr = this.reader.getFloat(node, attribute_name);
        if(!this.attrIsNumber(attr)) {
            throw this.isNanAttributeMessage(node.nodeName, attribute_name);
        }
        return attr;
    }

    parseIntAttr(node, attribute_name) {
        let attr = this.parseFloatAttr(node, attribute_name);
        if (!Number.isInteger(attr)) {
            throw this.isNotIntegerAttributeMessage(node.nodeName, attribute_name);
        }
     
        return attr;
    }

    parseCoords(node) {
        //parseFloatAttr throws if attr is NaN
        let x = this.parseFloatAttr(node, "x");
        let y = this.parseFloatAttr(node, "y");
        let z = this.parseFloatAttr(node, "z");
        return {x, y, z};
    }

    parseRGBA(node) {
        let r = this.parseFloatAttr(node, "r");
        let g = this.parseFloatAttr(node, "g");
        let b = this.parseFloatAttr(node, "b");
        let a = this.parseFloatAttr(node, "a");

        if (r < 0) {
            this.onXMLMinorError(`${node.nodeName} red attribute must be in the range [0, 1]. Assuming value 0.`);
            r = 0;
        } else if (r > 1) {
            this.onXMLMinorError(`${node.nodeName} red attribute must be in the range [0, 1]. Assuming value 1.`);
            r = 1;
        } else if (g < 0) {
            this.onXMLMinorError(`${node.nodeName} green attribute must be in the range [0, 1]. Assuming value 0.`);
            g = 0;
        } else if (g > 1) {
            this.onXMLMinorError(`${node.nodeName} green attribute must be in the range [0, 1]. Assuming value 1.`);
            g = 1;
        } else if (b < 0) {
            this.onXMLMinorError(`${node.nodeName} blue attribute must be in the range [0, 1]. Assuming value 0.`);
            b = 0;
        } else if (b > 1) {
            this.onXMLMinorError(`${node.nodeName} blue attribute must be in the range [0, 1]. Assuming value 1.`);
            b = 1;
        } else if (a < 0) {
            this.onXMLMinorError(`${node.nodeName} alpha attribute must be in the range [0, 1]. Assuming value 0.`);
            a = 0;
        } else if (a > 1) {
            this.onXMLMinorError(`${node.nodeName} alpha attribute must be in the range [0, 1]. Assuming value 1.`);
            a = 1;
        }

        return {r, g, b, a};
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(error) {
        console.error("XML Loading Error: ", error);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("XMLParserWarning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("XMLParserLog:   ", message);
    }

    verifyInheritableId(node_name, id, container) {
        if (!container.has(id) && id !== "inherit") {
            throw `${node_name} with id '${id}' is not defined.`;
        }
    }

    verifyInheritableNoneId(node_name, id, container) {
        if (!container.has(id) && id !== "inherit" && id !== "none") {
            throw `${node_name} with id '${id}' is not defined.`;
        }
    }

    /**
     * 
     * @param {string} node_name The name of the node
     * @param {string} attribute_name The name of the attribute
     */
    missingNodeAttributeMessage(node_name, attribute_name) {
        return `${node_name} ${attribute_name} attribute is not defined`;
    }

    /**
     * 
     * @param {string} node_name The name of the node
     * @param {string} attribute_name The name of the attribute
     */
    missingNodeMessage(node_name, attribute_name) {
        return `${node_name} '${attribute_name}' node is missing`;
    }

    /**
     * 
     * @param {string} node_name The name of the node
     * @param {string} attribute_name The name of the attribute
     */
    isNanAttributeMessage(node_name, attribute_name) {
        return `${node_name} ${attribute_name} attribute is not a number`;
    }

    isNotIntegerAttributeMessage(node_name, attribute_name) {
        return `${node_name} ${attribute_name} attribute is not an integer`;
    }

    notBooleanAttributeMessage(node_name, attribute_name) {
        return `${node_name} ${attribute_name} attribute is not of boolean type`;
    }

    idInUseMessage(node_name, id) {
        return `${node_name} '${id}' id is already in use`;
    }

    emptyIdMessage(node_name) {
        return `${node_name} id must not be empty`;
    }

    verifyUniqueId(node_name, container, id) {
        if (id === "") {
            throw this.emptyIdMessage(node_name);
        } else if (container.has(id)) {
            throw this.idInUseMessage(node_name, id);
        }
    }

    registerRequestedChildComponent(child_component_id) {
        this.requestedChildComponentIds.add(child_component_id);
    }

    verifyComponentChildren() {
        if(this.components.length < this.requestedChildComponentIds.length) {
            throw "some requested component ids were not found";
        }

        for(let child_component_id of this.requestedChildComponentIds) {
            if(!this.components.has(child_component_id)) {
                throw `child component with id ${child_component_id} was not defined!`;
            }
        }
    }
}