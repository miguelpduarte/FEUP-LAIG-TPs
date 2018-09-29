const XML_NODES = [
    'scene',
    'views',
    'ambient',
    'lights',
    'textures',
    'materials',
    'transformations',
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
        this.primitives = new Map();
        this.components = new Map();

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

        // Here should go the calls for different functions to parse the various blocks
        const error = this.parseXMLFile(rootElement);

        if (error) {
            this.onXMLError(error);
            return;
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
            return "root tag <yas> missing";
        }

        const nodes = rootElement.children;

        //Checking elements order
        for(let i = 0; i < XML_NODES.length; ++i) {
            if(nodes[i].nodeName !== XML_NODES[i]) {
                return "node " + XML_NODES[i] + " missing or out of order!";
            }
        }

        if(nodes.length > XML_NODES.length) {
            this.onXMLMinorError("The XML File has additional unexpected nodes. These were not parsed.");
        }

        let err;

        for(let i = 0; i < XML_NODES.length; ++i) {
            err = this.XML_ELEMENTS_PARSING_FUNCS[XML_NODES[i]](nodes[i]);
            if(err) {
                return err;
            }
        }
    }

    /**
     * Parses the <INITIALS> block.
     */
    parseInitials_old(initialsNode) {

        var children = initialsNode.children;

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        // Frustum planes
        // (default values)
        this.near = 0.1;
        this.far = 500;
        var indexFrustum = nodeNames.indexOf("frustum");
        if (indexFrustum == -1) {
            this.onXMLMinorError("frustum planes missing; assuming 'near = 0.1' and 'far = 500'");
        }
        else {
            this.near = this.reader.getFloat(children[indexFrustum], 'near');
            this.far = this.reader.getFloat(children[indexFrustum], 'far');

            if (!(this.near != null && !isNaN(this.near))) {
                this.near = 0.1;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
            }
            else if (!(this.far != null && !isNaN(this.far))) {
                this.far = 500;
                this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
            }

            if (this.near >= this.far)
                return "'near' must be smaller than 'far'";
        }

        // Checks if at most one translation, three rotations, and one scaling are defined.
        if (initialsNode.getElementsByTagName('translation').length > 1)
            return "no more than one initial translation may be defined";

        if (initialsNode.getElementsByTagName('rotation').length > 3)
            return "no more than three initial rotations may be defined";

        if (initialsNode.getElementsByTagName('scale').length > 1)
            return "no more than one scaling may be defined";

        // Initial transforms.
        this.initialTranslate = [];
        this.initialScaling = [];
        this.initialRotations = [];

        // Gets indices of each element.
        var translationIndex = nodeNames.indexOf("translation");
        var thirdRotationIndex = nodeNames.indexOf("rotation");
        var secondRotationIndex = nodeNames.indexOf("rotation", thirdRotationIndex + 1);
        var firstRotationIndex = nodeNames.lastIndexOf("rotation");
        var scalingIndex = nodeNames.indexOf("scale");

        // Checks if the indices are valid and in the expected order.
        // Translation.
        this.initialTransforms = mat4.create();
        mat4.identity(this.initialTransforms);

        if (translationIndex == -1)
            this.onXMLMinorError("initial translation undefined; assuming T = (0, 0, 0)");
        else {
            var tx = this.reader.getFloat(children[translationIndex], 'x');
            var ty = this.reader.getFloat(children[translationIndex], 'y');
            var tz = this.reader.getFloat(children[translationIndex], 'z');

            if (tx == null || ty == null || tz == null) {
                tx = 0;
                ty = 0;
                tz = 0;
                this.onXMLMinorError("failed to parse coordinates of initial translation; assuming zero");
            }

            //TODO: Save translation data
        }

        //TODO: Parse Rotations

        //TODO: Parse Scaling

        //TODO: Parse Reference length

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <LIGHTS> node.
     * @param {lights block element} lightsNode
     */
    parseLights_old(lightsNode) {

        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "LIGHT") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var enableIndex = nodeNames.indexOf("enable");
            var positionIndex = nodeNames.indexOf("position");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Light enable/disable
            var enableLight = true;
            if (enableIndex == -1) {
                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
            }
            else {
                var aux = this.reader.getFloat(grandChildren[enableIndex], 'value');
                if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                    this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                else
                    enableLight = aux == 0 ? false : true;
            }

            // Retrieves the light position.
            var positionLight = [];
            if (positionIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(w);
            }
            else
                return "light position undefined for ID = " + lightId;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;

            // TODO: Retrieve the diffuse component

            // TODO: Retrieve the specular component

            // TODO: Store Light global information.
            //this.lights[lightId] = ...;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");

        return null;
    }


    /**
     * Parses the <scene> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {
        if(!this.reader.hasAttribute(sceneNode, "root")) {
            return this.missingNodeAttributeMessage("scene", "root");
        }
        
        if(!this.reader.hasAttribute(sceneNode, "axis_length")) {
            return this.missingNodeAttributeMessage("scene", "axis_length");
        }
        
        this.referentialLength = this.reader.getFloat(sceneNode, "axis_length");
        
        if(!this.attrIsNumber(this.referentialLength)) {
            return this.isNanAttributeMessage("scene", "axis_length");
        }

        this.rootElementId = this.reader.getString(sceneNode, "root");
    }

    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {
        if(!this.reader.hasAttribute(viewsNode, "default")) {
            return this.missingNodeAttributeMessage("views", "default");
        }

        this.defaultViewId = this.reader.getString(viewsNode, "default");

        //Check if it has one view defined at least and it matches the default view id
        const views = viewsNode.children;

        let err;
        for(let i = 0; i < views.length; ++i) {
            if(views[i].nodeName === "perspective") {
                err = this.createPerspectiveCamera(views[i]);
            } else if(views[i].nodeName === "ortho") {
                err = this.createOrthoCamera(views[i]);
            }

            if(err) {
                return err;
            }
        }

        if(this.cameras.size === 0) {
            return "no views were defined";
        }

        if(!this.cameras.has(this.defaultViewId)) {
            return "specified default view id does not exist";
        }
    }

    createPerspectiveCamera(viewNode) {
        //id
        if(!this.reader.hasAttribute(viewNode, "id")) {
            return this.missingNodeAttributeMessage("perspective", "id");
        }
        let id = this.reader.getString(viewNode, "id");

        //near
        let near = this.parseFloatAttr(viewNode, "near");
        if (typeof near !== "number") {
            return near;
        }

        //far
        let far = this.parseFloatAttr(viewNode, "far");
        if (typeof far !== "number") {
            return far;
        }

        //near must be smaller than far
        if (near >= far) {
            return "perspective near attribute must be smaller than far attribute";
        }

        //angle
        let angle = this.parseFloatAttr(viewNode, "angle");
        if (typeof angle !== "number") {
            return angle;
        }

        const cameraCoords = viewNode.children;

        if (cameraCoords.length !== 2) {
            return "perspective '" + id + "' invalid number of camera coordinates";
        } else if (cameraCoords[0].nodeName !== "from") {
            return this.missingNodeMessage("perspective", "from");
        } else if (cameraCoords[1].nodeName !== "to") {
            return this.missingNodeMessage("perspective", "to");
        }

        let from = this.parseCoords(cameraCoords[0]);
        if (typeof from === "string") {
            return from;
        }

        let to = this.parseCoords(cameraCoords[1]);
        if (typeof to === "string") {
            return to;
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

        let err = this.verifyUniqueId("perspective", this.cameras, id);
        if (err) {
            return err;
        }

        this.cameras.set(cam.id, cam);
    }

    createOrthoCamera(viewNode) {
        //id
        if(!this.reader.hasAttribute(viewNode, "id")) {
            return this.missingNodeAttributeMessage("ortho", "id");
        }
        let id = this.reader.getString(viewNode, "id");

        ///near
        let near = this.parseFloatAttr(viewNode, "near");
        if (typeof near !== "number") {
            return near;
        }

        //far
        let far = this.parseFloatAttr(viewNode, "far");
        if (typeof far !== "number") {
            return far;
        }

        //near must be smaller than far
        if (near >= far) {
            return "ortho near attribute must be smaller than far attribute";
        }

        // TODO: left <= right ?
        //left
        let left = this.parseFloatAttr(viewNode, "left");
        if (typeof left !== "number") {
            return left;
        }

        //right
        let right = this.parseFloatAttr(viewNode, "right");
        if (typeof right !== "number") {
            return right;
        }

        // TODO: bottom <= top ?
        //bottom
        let bottom = this.parseFloatAttr(viewNode, "bottom");
        if (typeof bottom !== "number") {
            return bottom;
        }

        //top
        let top = this.parseFloatAttr(viewNode, "top");
        if (typeof top !== "number") {
            return top;
        }

        console.log("Ortho not created: left? right? top? bottom? what?");

        const cam = {
            type: "ortho",
            id,
            near,
            far,
            left,
            right,
            bottom,
            top
        }

        let err = this.verifyUniqueId("ortho", this.cameras, id);
        if (err) {
            return err;
        }

        this.cameras.set(cam.id, cam);
    }

    parseAmbient(ambientNode) {
        const children = ambientNode.children;

        if (children.length !== 2) {
            return "ambient invalid number of child nodes";
        } else if (children[0].nodeName !== "ambient") {
            return this.missingNodeMessage("ambient", "ambient");
        } else if (children[1].nodeName !== "background") {
            return this.missingNodeMessage("ambient", "background");
        }

        this.ambient = this.parseRGBA(children[0]);
        if (typeof this.ambient === "string") {
            return this.ambient;
        }

        this.background = this.parseRGBA(children[1]);
        if (typeof this.background === "string") {
            return this.background;
        }
    }

    parseLights(lightsNode) {
        const lights = lightsNode.children;

        let err;
        for(let i = 0; i < lights.length; ++i) {
            if(lights[i].nodeName === "omni") {
                err = this.createOmniLight(lights[i]);
            } else if(lights[i].nodeName === "spot") {
                err = this.createSpotLight(lights[i]);
            }

            if(err) {
                return err;
            }
        }

        if(this.lights.size === 0) {
            return "no lights were defined";
        }
    }

    createOmniLight(lightNode) {
        //id
        if(!this.reader.hasAttribute(lightNode, "id")) {
            return this.missingNodeAttributeMessage("omni", "id");
        }
        let id = this.reader.getString(lightNode, "id");

        //enabled
        if(!this.reader.hasAttribute(lightNode, "enabled")) {
            return this.missingNodeAttributeMessage("omni", "enabled");
        }
        const enabled = this.reader.getBoolean(lightNode, "enabled");
        if (enabled === null) {
            return this.notBooleanAttributeMessage(lightNode.nodeName, "enabled");
        }

        const lightProperties = lightNode.children;

        if (lightProperties.length !== 4) {
            return "omni '" + id + "' invalid number of light coordinates";
        } else if (lightProperties[0].nodeName !== "location") {
            return this.missingNodeMessage("omni", "location");
        } else if (lightProperties[1].nodeName !== "ambient") {
            return this.missingNodeMessage("omni", "ambient");
        } else if (lightProperties[2].nodeName !== "diffuse") {
            return this.missingNodeMessage("omni", "diffuse");
        } else if (lightProperties[3].nodeName !== "specular") {
            return this.missingNodeMessage("omni", "specular");
        }

        let locationNode = lightProperties[0]
        let location = this.parseCoords(locationNode);
        if (typeof location === "string") {
            return location;
        }
        let w = this.parseFloatAttr(locationNode, "w");
        if (typeof w !== "number") {
            return w;
        }
        location.w = w;

        let ambient = this.parseRGBA(lightProperties[1]);
        if (typeof ambient === "string") {
            return ambient;
        }

        let diffuse = this.parseRGBA(lightProperties[2]);
        if (typeof diffuse === "string") {
            return diffuse;
        }

        let specular = this.parseRGBA(lightProperties[3]);
        if (typeof specular === "string") {
            return specular;
        }

        const light = {
            type: "omni",
            id,
            enabled,
            location,
            ambient,
            diffuse,
            specular
        }

        let err = this.verifyUniqueId("omni", this.lights, id);
        if (err) {
            return err;
        }

        this.lights.set(light.id, light);
    }

    createSpotLight(lightNode) {
        //id
        if(!this.reader.hasAttribute(lightNode, "id")) {
            return this.missingNodeAttributeMessage("spot", "id");
        }
        let id = this.reader.getString(lightNode, "id");

        if(!this.reader.hasAttribute(lightNode, "enabled")) {
            return this.missingNodeAttributeMessage("spot", "enabled");
        }
        const enabled = this.reader.getBoolean(lightNode, "enabled");
        if (enabled === null) {
            return this.notBooleanAttributeMessage(lightNode.nodeName, "enabled");
        }

        //angle
        let angle = this.parseFloatAttr(lightNode, "angle");
        if (typeof angle !== "number") {
            return angle;
        }

        //exponent
        let exponent = this.parseFloatAttr(lightNode, "exponent");
        if (typeof exponent !== "number") {
            return exponent;
        }

        const lightProperties = lightNode.children;

        if (lightProperties.length !== 5) {
            return "spot '" + id + "' invalid number of light coordinates";
        } else if (lightProperties[0].nodeName !== "location") {
            return this.missingNodeMessage("spot", "location");
        } else if (lightProperties[1].nodeName !== "target") {
            return this.missingNodeMessage("spot", "target");
        } else if (lightProperties[2].nodeName !== "ambient") {
            return this.missingNodeMessage("spot", "ambient");
        } else if (lightProperties[3].nodeName !== "diffuse") {
            return this.missingNodeMessage("spot", "diffuse");
        } else if (lightProperties[4].nodeName !== "specular") {
            return this.missingNodeMessage("spot", "specular");
        }

        let locationNode = lightProperties[0]
        let location = this.parseCoords(locationNode);
        if (typeof location === "string") {
            return location;
        }
        let w = this.parseFloatAttr(locationNode, "w");
        if (typeof w !== "number") {
            return w;
        }
        location.w = w;

        let target = this.parseCoords(lightProperties[1]);
        if (typeof target === "string") {
            return target;
        }

        let ambient = this.parseRGBA(lightProperties[2]);
        if (typeof ambient === "string") {
            return ambient;
        }

        let diffuse = this.parseRGBA(lightProperties[3]);
        if (typeof diffuse === "string") {
            return diffuse;
        }

        let specular = this.parseRGBA(lightProperties[4]);
        if (typeof specular === "string") {
            return specular;
        }

        const light = {
            type: "spot",
            id,
            enabled,
            location,
            target,
            ambient,
            diffuse,
            specular
        }

        let err = this.verifyUniqueId("spot", this.lights, id);
        if (err) {
            return err;
        }

        this.lights.set(light.id, light);
    }

    parseTextures(texturesNode) {
        const textures = texturesNode.children;

        let err;
        for(let i = 0; i < textures.length; ++i) {
            err = this.createTexture(textures[i]);

            if(err) {
                return err;
            }
        }

        if(this.textures.size === 0) {
            return "no textures were defined";
        }
    }

    createTexture(textureNode) {
        //id
        if(!this.reader.hasAttribute(textureNode, "id")) {
            return this.missingNodeAttributeMessage("texture", "id");
        }
        let id = this.reader.getString(textureNode, "id");

        //file
        if(!this.reader.hasAttribute(textureNode, "file")) {
            return this.missingNodeAttributeMessage("texture", "file");
        }
        let file = this.reader.getString(textureNode, "file");

        const texture = {
            id,
            file
        }

        let err = this.verifyUniqueId("texture", this.textures, id);
        if (err) {
            return err;
        }

        this.textures.set(texture.id, texture);
    }

    parseMaterials(materialsNode) {
        const materials = materialsNode.children;

        let err;
        for(let i = 0; i < materials.length; ++i) {
            err = this.createMaterial(materials[i]);

            if(err) {
                return err;
            }
        }

        if(this.materials.size === 0) {
            return "no materials were defined";
        }
    }

    createMaterial(materialNode) {
        //id
        if(!this.reader.hasAttribute(materialNode, "id")) {
            return this.missingNodeAttributeMessage("material", "id");
        }
        let id = this.reader.getString(materialNode, "id");

        //shininess
        let shininess = this.parseFloatAttr(materialNode, "shininess");
        if (typeof shininess !== "number") {
            return shininess;
        }

        const materialProperties = materialNode.children;

        if (materialProperties.length !== 4) {
            return "material '" + id + "' invalid number of material propreties ";
        } else if (materialProperties[0].nodeName !== "emission") {
            return this.missingNodeMessage("material", "emission");
        } else if (materialProperties[1].nodeName !== "ambient") {
            return this.missingNodeMessage("material", "ambient");
        } else if (materialProperties[2].nodeName !== "diffuse") {
            return this.missingNodeMessage("material", "diffuse");
        } else if (materialProperties[3].nodeName !== "specular") {
            return this.missingNodeMessage("material", "specular");
        }

        let emission = this.parseRGBA(materialProperties[0]);
        if (typeof emission === "string") {
            return emission;
        }

        let ambient = this.parseRGBA(materialProperties[1]);
        if (typeof ambient === "string") {
            return ambient;
        }

        let diffuse = this.parseRGBA(materialProperties[2]);
        if (typeof diffuse === "string") {
            return diffuse;
        }

        let specular = this.parseRGBA(materialProperties[3]);
        if (typeof specular === "string") {
            return specular;
        }

        const material = {
            id,
            shininess,
            emission,
            ambient,
            diffuse,
            specular
        }

        let err = this.verifyUniqueId("material", this.materials, id);
        if (err) {
            return err;
        }

        this.materials.set(material.id, material);
    }

    parseTransformations(transformationsNode) {
        const transformations = transformationsNode.children;

        let err;
        for(let i = 0; i < transformations.length; ++i) {
            err = this.parseTransformation(transformations[i]);

            if(err) {
                return err;
            }
        }

        if(this.transformations.size === 0) {
            return "no transformations were defined";
        }
    }

    parseTransformation(transformationNode) {
        //id
        if(!this.reader.hasAttribute(transformationNode, "id")) {
            return this.missingNodeAttributeMessage("transformation", "id");
        }
        let id = this.reader.getString(transformationNode, "id");

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
                return "invalid transformation '" + transformations[i].nodeName + "' in transformation with id '" + id + "'";
            }

            if (typeof ret === "string") {
                return ret;
            } else {
                transformation.transformations.push(ret);
            }
        }

        if (transformation.transformations.length === 0) {
            return "transformation with id '" + id + "' is empty";
        }

        let err = this.verifyUniqueId("transformation", this.transformations, id);
        if (err) {
            return err;
        }

        this.transformations.set(transformation.id, transformation);
    }

    createTranslate(transformationNode) {
        let translate = this.parseCoords(transformationNode);
        if (typeof translate !== "string") {
            translate.type = "translate";
        }

        return translate;
    }

    createRotate(transformationNode) {
        //axis
        if(!this.reader.hasAttribute(transformationNode, "axis")) {
            return this.missingNodeAttributeMessage("transformation", "axis");
        }
        let axis = this.reader.getString(transformationNode, "axis");
        if (axis !== "x" && axis !== "y" && axis !== "z") {
            return "rotate transformation with invalid axis (must be 'x', 'y' or 'z')";
        }

        //angle
        let angle = this.parseFloatAttr(transformationNode, "angle");
        if (typeof angle !== "number") {
            return angle;
        }

        return {
            type: "rotate",
            axis,
            angle
        }
    }

    createScale(transformationNode) {
        let scale = this.parseCoords(transformationNode);
        if (typeof scale !== "string") {
            scale.type = "scale";
        }

        return scale;
    }

    parsePrimitives(primitivesNode) {
        const primitives = primitivesNode.children;

        let err;
        for(let i = 0; i < primitives.length; ++i) {
            err = this.parsePrimitive(primitives[i]);

            if(err) {
                return err;
            }
        }

        if(this.primitives.size === 0) {
            return "no primitives were defined";
        }
    }

    parsePrimitive(primitiveNode) {
        //id
        if(!this.reader.hasAttribute(primitiveNode, "id")) {
            return this.missingNodeAttributeMessage("primitive", "id");
        }
        let id = this.reader.getString(primitiveNode, "id");

        const childNodes = primitiveNode.children;

        if (childNodes.length > 1) {
            return "primitive with id '" + id + "' has more than one tag";
        } else if (childNodes.length === 0) {
            return "primitive with id '" + id + "' is empty";
        }

        let primitiveChild = childNodes[0];

        let primitive;
        if (primitiveChild.nodeName === "rectangle") {
            primitive = this.createRectangle(primitiveChild);
        } else if (primitiveChild.nodeName === "triangle") {
            primitive = this.createTriangle(primitiveChild);
        } else if (primitiveChild.nodeName === "cylinder") {
            primitive = this.createCylinder(primitiveChild);
        } else if (primitiveChild.nodeName === "sphere") {
            primitive = this.createSphere(primitiveChild);
        } else if (primitiveChild.nodeName === "torus") {
            primitive = this.createTorus(primitiveChild);
        } else {
            return "invalid primitive type '" + primitiveChild.nodeName + "' in primitive with id '" + id + "'";
        }

        if (typeof primitive === "string") {
            return primitive;
        }

        primitive.id = id;

        let err = this.verifyUniqueId("primitive", this.primitives, id);
        if (err) {
            return err;
        }

        this.primitives.set(primitive.id, primitive);
    }

    createRectangle(primitiveNode) {
        let x1 = this.parseFloatAttr(primitiveNode, "x1");
        if (typeof x1 !== "number") {
            return x1;
        }

        let y1 = this.parseFloatAttr(primitiveNode, "y1");
        if (typeof y1 !== "number") {
            return y1;
        }

        let x2 = this.parseFloatAttr(primitiveNode, "x2");
        if (typeof x2 !== "number") {
            return x2;
        }

        let y2 = this.parseFloatAttr(primitiveNode, "y2");
        if (typeof y2 !== "number") {
            return y2;
        }

        return {
            type: "rectangle",
            x1, y1,
            x2, y2
        }
    }

    createTriangle(primitiveNode) {
        let x1 = this.parseFloatAttr(primitiveNode, "x1");
        if (typeof x1 !== "number") {
            return x1;
        }

        let y1 = this.parseFloatAttr(primitiveNode, "y1");
        if (typeof y1 !== "number") {
            return y1;
        }

        let z1 = this.parseFloatAttr(primitiveNode, "z1");
        if (typeof z1 !== "number") {
            return z1;
        }

        let x2 = this.parseFloatAttr(primitiveNode, "x2");
        if (typeof x2 !== "number") {
            return x2;
        }

        let y2 = this.parseFloatAttr(primitiveNode, "y2");
        if (typeof y2 !== "number") {
            return y2;
        }

        let z2 = this.parseFloatAttr(primitiveNode, "z2");
        if (typeof z2 !== "number") {
            return z2;
        }

        let x3 = this.parseFloatAttr(primitiveNode, "x3");
        if (typeof x3 !== "number") {
            return x3;
        }

        let y3 = this.parseFloatAttr(primitiveNode, "y3");
        if (typeof y3 !== "number") {
            return y3;
        }

        let z3 = this.parseFloatAttr(primitiveNode, "z3");
        if (typeof z3 !== "number") {
            return z3;
        }
           
        return {
            type: "triangle",
            x1, y1, z1,
            x2, y2, z2,
            x3, y3, z3
        }
    }

    createCylinder(primitiveNode) {
        let base = this.parseFloatAttr(primitiveNode, "base");
        if (typeof base !== "number") {
            return base;
        }

        let top = this.parseFloatAttr(primitiveNode, "top");
        if (typeof top !== "number") {
            return top;
        }

        let height = this.parseFloatAttr(primitiveNode, "height");
        if (typeof height !== "number") {
            return height;
        }

        let slices = this.parseIntAttr(primitiveNode, "slices");
        if (typeof slices !== "number") {
            return slices;
        }

        let stacks = this.parseIntAttr(primitiveNode, "stacks");
        if (typeof stacks !== "number") {
            return stacks;
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

    createSphere(primitiveNode) {
        let radius = this.parseFloatAttr(primitiveNode, "radius");
        if (typeof radius !== "number") {
            return radius;
        }

        let slices = this.parseIntAttr(primitiveNode, "slices");
        if (typeof slices !== "number") {
            return slices;
        }

        let stacks = this.parseIntAttr(primitiveNode, "stacks");
        if (typeof stacks !== "number") {
            return stacks;
        }

        return {
            type: "sphere",
            radius,
            slices,
            stacks
        }
    }

    createTorus(primitiveNode) {
        let inner = this.parseFloatAttr(primitiveNode, "inner");
        if (typeof inner !== "number") {
            return inner;
        }

        let outer = this.parseFloatAttr(primitiveNode, "outer");
        if (typeof outer !== "number") {
            return outer;
        }

        let slices = this.parseIntAttr(primitiveNode, "slices");
        if (typeof slices !== "number") {
            return slices;
        }

        let loops = this.parseIntAttr(primitiveNode, "loops");
        if (typeof loops !== "number") {
            return loops;
        }

        return {
            type: "torus",
            inner,
            outer,
            slices,
            loops
        }
    }

    parseComponents(componentsNode) {
        console.log('Parsing components', componentsNode);

        const components = componentsNode.children;

        let err;
        for(let i = 0; i < components.length; ++i) {
            err = this.createComponent(components[i]);

            if(err) {
                return err;
            }
        }

        if(this.components.size === 0) {
            return "no components were defined";
        }
    }

    createComponent(componentNode) {
        //id
        if(!this.reader.hasAttribute(componentNode, "id")) {
            return this.missingNodeAttributeMessage("transformation", "id");
        }
        let id = this.reader.getString(componentNode, "id");

        const componentProperties = componentNode.children;

        if (componentProperties.length !== 4) {
            return "component '" + id + "' invalid number of component properties";
        } else if (componentProperties[0].nodeName !== "transformation") {
            return this.missingNodeMessage("component", "transformation");
        } else if (componentProperties[1].nodeName !== "materials") {
            return this.missingNodeMessage("component", "materials");
        } else if (componentProperties[2].nodeName !== "texture") {
            return this.missingNodeMessage("component", "texture");
        } else if (componentProperties[3].nodeName !== "children") {
            return this.missingNodeMessage("component", "children");
        }
        
        const component = {
            id
        };

        let err = this.verifyUniqueId("component", this.components, id);
        if (err) {
            return err;
        }

        this.components.set(component.id, component);
    }

    attrIsNumber(attribute) {
        return !isNaN(attribute);
    }
    
    parseFloatAttr(node, attribute_name) {
        if(!this.reader.hasAttribute(node, attribute_name)) {
            return this.missingNodeAttributeMessage(node.nodeName, attribute_name);
        }
        let attr = this.reader.getFloat(node, attribute_name);
        if(!this.attrIsNumber(attr)) {
            return this.isNanAttributeMessage(node.nodeName, attribute_name);
        }
        return attr;
    }

    parseIntAttr(node, attribute_name) {
        let attr = this.parseFloatAttr(node, attribute_name);
        if (typeof attr === "number" && !Number.isInteger(attr)) {
            return this.isNotIntegerAttributeMessage(node.nodeName, attribute_name);
        } else {
            return attr;
        }
    }

    parseCoords(node) {
        let x = this.parseFloatAttr(node, "x");
        if (typeof x !== "number") {
            return x;
        }

        let y = this.parseFloatAttr(node, "y");
        if (typeof y !== "number") {
            return y;
        }

        let z = this.parseFloatAttr(node, "z");
        if (typeof z !== "number") {
            return z;
        }

        return {x, y, z};
    }

    parseRGBA(node) {
        let r = this.parseFloatAttr(node, "r");
        if (typeof r !== "number") {
            return r;
        }

        let g = this.parseFloatAttr(node, "g");
        if (typeof g !== "number") {
            return g;
        }

        let b = this.parseFloatAttr(node, "b");
        if (typeof b !== "number") {
            return b;
        }

        let a = this.parseFloatAttr(node, "a");
        if (typeof a !== "number") {
            return a;
        }

        if (a < 0 || a > 1) {
            return `${node.nodeName} alpha attribute must be in the range [0, 1]`;
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
    
    /* verifyUniqueId(node_name, id) {
        if (id === "") {
            return `node ${node_name}: id cannot be empty`;
        }
        else if (this.elementIds.has(id)) {
            return `node ${node_name}: '${id}' id already exists`;
        }
        else {
            this.elementIds.add(id);
            return false;
        }
    } */

    idInUseMessage(node_name, id) {
        return `${node_name} '${id}' id is already in use`;
    }

    emptyIdMessage(node_name) {
        return `${node_name} id must not be empty`;
    }

    verifyUniqueId(node_name, container, id) {
        if (id === "") {
            return this.emptyIdMessage(node_name);
        }
        else if (container.has(id)) {
            return this.idInUseMessage(node_name, id);
        }
        else {
            return false;
        }
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}