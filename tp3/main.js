//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 
//Include additional files here
serialInclude([
    '../lib/CGF.js', 
    'XMLscene.js', 
    'MySceneGraph.js', 
    'MyInterface.js', 
    'primitives/PrimitiveObject.js', 
    'primitives/Rectangle.js', 
    'primitives/Sphere.js',
    'primitives/Triangle.js',
    'primitives/Cylinder.js',
    'primitives/Circle.js',
    'primitives/CylinderSide.js',
    'primitives/Torus.js',
    'PrimitiveFactory.js',
    'TransformationFactory.js',
    'Component.js',
    'PieceComponent.js',
    'Piece.js',
    'animations/Animation.js',
    'animations/LinearAnimation.js',
    'animations/CircularAnimation.js',
    'primitives/Plane.js',
    'primitives/Cylinder2.js',
    'primitives/Patch.js',
    'primitives/Terrain.js',
    'primitives/Vehicle.js',
    'primitives/Water.js',
    'primitives/Flag.js',
    'primitives/Board.js',
    'primitives/Bishop.js',
    'primitives/Pawn.js',
    'primitives/King.js',
    'primitives/Cube.js',
    'primitives/Clock.js',
    'primitives/Button.js',
    'primitives/ScoreBoard.js',
    'game/CommunicationHandler.js',
    'game/GameState.js',
    'game/CameraHandler.js',
    'game/ClickHandler.js',
    'game/MenuHandler.js',
    'menus/Menu.js',

    main = () => {
        // Standard application, scene and interface setup
        const app = new CGFapplication(document.body);
        const myInterface = new MyInterface();
        const myScene = new XMLscene(myInterface);

        app.init();

        app.setScene(myScene);
        app.setInterface(myInterface);

        myInterface.setActiveCamera(myScene.camera);

        // get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
        // or use the given default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
        const filename = getUrlVars()['file'] || "scene1.xml";
        myInterface.setFilename(filename);

        // Create graph (XML parser), and associate it to scene
        const myGraph = new MySceneGraph(myScene);
        // Load the XML file (check console for loading errors)
        myGraph.loadXML(filename);
        
        // start the app
        app.run();
    }
]);