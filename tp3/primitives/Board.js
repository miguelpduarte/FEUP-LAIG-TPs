/**
 * Board
 * @constructor
 */
class Board extends PrimitiveObject {
	constructor(scene, createNurbsObject) {
        super(scene);

        this.createNurbsObject = createNurbsObject;
        this.board_size = 20;
        this.board_height = 0.3;
        this.board_margin = 0.625;
        this.square_size = 1.875;
        this.piece_offset = this.board_margin + this.square_size/2;

        this.createBoard();
        this.createPieces();
        this.initMaterials();
    };
    
    display() {
        this.scene.pushMatrix();
            this.scene.translate(this.piece_offset + this.square_size, this.board_height, this.piece_offset);
            this.light_bishop_material.apply();
            this.piece2.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(this.piece_offset + 3*this.square_size, this.board_height, this.piece_offset);
            this.dark_bishop_material.apply();
            this.piece3.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(this.piece_offset, this.board_height, this.piece_offset + this.square_size);
            this.dark_bishop_material.apply();
            this.piece.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(this.piece_offset + 2*this.square_size, this.board_height, this.piece_offset + this.square_size);
            this.light_bishop_material.apply();
            this.piece.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(this.piece_offset + this.square_size, this.board_height, this.piece_offset + 2*this.square_size);
            this.dark_bishop_material.apply();
            this.piece2.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(this.piece_offset + 3*this.square_size, this.board_height, this.piece_offset + 2*this.square_size);
            this.light_bishop_material.apply();
            this.piece3.display();
        this.scene.popMatrix();

        this.scene.translate(this.board_size/2, 0, this.board_size/2);
        // Board Cover
        this.scene.pushMatrix();
            this.scene.translate(0, this.board_height, 0);
            this.scene.scale(this.board_size, this.board_size, this.board_size);
            this.board_cover_material.apply();
            this.board_cover.display();
        this.scene.popMatrix();

        // Board Bottom
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.scene.scale(this.board_size, this.board_size, this.board_size);
            this.board_bottom_material.apply();
            this.board_cover.display();
        this.scene.popMatrix();

        // Board edges
        this.scene.pushMatrix();
            this.scene.translate(0, this.board_height/2, this.board_size/2);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(this.board_size, 0, this.board_height);
            this.board_edge_material.apply();
            this.board_edge.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.scene.translate(0, this.board_height/2, this.board_size/2);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(this.board_size, 0, this.board_height);
            this.board_edge_material.apply();
            this.board_edge.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.scene.translate(0, this.board_height/2, this.board_size/2);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(this.board_size, 0, this.board_height);
            this.board_edge_material.apply();
            this.board_edge.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.rotate(-Math.PI/2, 0, 1, 0);
            this.scene.translate(0, this.board_height/2, this.board_size/2);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(this.board_size, 0, this.board_height);
            this.board_edge_material.apply();
            this.board_edge.display();
        this.scene.popMatrix();
    }

    createBoard() {
        this.board_cover = new Plane(
            this.scene, 
            {
                npartsU: 20,
                npartsV: 20
            },
            this.createNurbsObject
        );

        this.board_edge = new Plane(
            this.scene, 
            {
                npartsU: 20,
                npartsV: 4
            },
            this.createNurbsObject
        );
    }

    createPieces() {
        this.piece = new Pawn(this.scene, this.createNurbsObject);
        this.piece2 = new Bishop(this.scene, this.createNurbsObject);
        this.piece3 = new King(this.scene, this.createNurbsObject);
    }

    initMaterials() {
        this.board_cover_texture = new CGFtexture(this.scene, "primitives/resources/board.jpg");
        this.board_edge_texture = new CGFtexture(this.scene, "primitives/resources/board_edge.jpg");
        this.board_bottom_texture = new CGFtexture(this.scene, "primitives/resources/board_bottom.jpg");
        this.dark_bishop_texture = new CGFtexture(this.scene, "primitives/resources/dark_bishop.jpg");
        this.light_bishop_texture = new CGFtexture(this.scene, "primitives/resources/light_bishop.jpg");

        this.board_cover_material = new CGFappearance(this.scene);
        this.board_cover_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.board_cover_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.board_cover_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.board_cover_material.setEmission(0, 0, 0, 1);
        this.board_cover_material.setShininess(25);
        this.board_cover_material.setTexture(this.board_cover_texture);

        this.board_edge_material = new CGFappearance(this.scene);
        this.board_edge_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.board_edge_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.board_edge_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.board_edge_material.setEmission(0, 0, 0, 1);
        this.board_edge_material.setShininess(25);
        this.board_edge_material.setTexture(this.board_edge_texture);

        this.board_bottom_material = new CGFappearance(this.scene);
        this.board_bottom_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.board_bottom_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.board_bottom_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.board_bottom_material.setEmission(0, 0, 0, 1);
        this.board_bottom_material.setShininess(25);
        this.board_bottom_material.setTexture(this.board_bottom_texture);

        this.dark_bishop_material = new CGFappearance(this.scene);
        this.dark_bishop_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.dark_bishop_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.dark_bishop_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.dark_bishop_material.setEmission(0, 0, 0, 1);
        this.dark_bishop_material.setShininess(25);
        this.dark_bishop_material.setTexture(this.dark_bishop_texture);

        this.light_bishop_material = new CGFappearance(this.scene);
        this.light_bishop_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.light_bishop_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.light_bishop_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.light_bishop_material.setEmission(0, 0, 0, 1);
        this.light_bishop_material.setShininess(25);
        this.light_bishop_material.setTexture(this.light_bishop_texture);
    }
};