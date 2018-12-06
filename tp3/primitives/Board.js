/**
 * Board
 * @constructor
 */
class Board extends PrimitiveObject {
	constructor(scene, createNurbsObject) {
        super(scene);

        this.createNurbsObject = createNurbsObject;
        this.board_size = 4;
        this.board_height = 0.1;
        this.board_margin = this.board_size/32;
        this.square_size = (this.board_size - 2*this.board_margin)/10;
        this.piece_offset = this.board_margin + this.square_size/2;
        this.piece_size_ratio = this.board_size / 20;

        this.createTouchSquare();
        this.createBoard();
        this.createPieces();
        this.initMaterials();
    };
    
    display() {
        this.drawTouchSquares();
        
        this.drawPiece(0, 1, "light");
        this.drawPiece(0, 3, "dark");
        this.drawPiece(0, 5, "dark");
        this.drawPiece(0, 5, "dark");
        this.drawPiece(1, 0, "light");
        this.drawPiece(1, 2, "dark");
        this.drawPiece(1, 4, "dark");
        this.drawPiece(2, 1, "light");
        this.drawPiece(2, 3, "light");
        this.drawPiece(2, 5, "dark");
        this.drawPiece(3, 0, "dark");
        this.drawPiece(3, 2, "light");
        this.drawPiece(3, 4, "light");
        this.drawPiece(4, 1, "dark");
        this.drawPiece(4, 3, "dark");
        this.drawPiece(4, 5, "light");
        this.drawPiece(5, 0, "light");
        this.drawPiece(5, 2, "dark");
        this.drawPiece(5, 4, "dark");

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

    createTouchSquare() {
        this.touch_square = new Plane(
            this.scene, 
            {
                npartsU: 1,
                npartsV: 1
            },
            this.createNurbsObject
        );
        this.touch_square.pickingEnabled = true;
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
        this.piece = new Bishop(this.scene, this.createNurbsObject);
    }

    initMaterials() {
        this.board_cover_texture = new CGFtexture(this.scene, "primitives/resources/board.jpg");
        this.board_edge_texture = new CGFtexture(this.scene, "primitives/resources/board_edge.jpg");
        this.board_bottom_texture = new CGFtexture(this.scene, "primitives/resources/board_bottom.jpg");
        this.dark_piece_texture = new CGFtexture(this.scene, "primitives/resources/dark_piece.jpg");
        this.light_piece_texture = new CGFtexture(this.scene, "primitives/resources/light_piece.jpg");
        this.piece_material = {};

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

        this.piece_material["dark"] = new CGFappearance(this.scene);
        this.piece_material["dark"].setAmbient(0.15, 0.15, 0.15, 1);
        this.piece_material["dark"].setDiffuse(0.5, 0.5, 0.5, 1);
        this.piece_material["dark"].setSpecular(0.3, 0.3, 0.3, 1);
        this.piece_material["dark"].setEmission(0, 0, 0, 1);
        this.piece_material["dark"].setShininess(25);
        this.piece_material["dark"].setTexture(this.dark_piece_texture);

        this.piece_material["light"] = new CGFappearance(this.scene);
        this.piece_material["light"].setAmbient(0.15, 0.15, 0.15, 1);
        this.piece_material["light"].setDiffuse(0.5, 0.5, 0.5, 1);
        this.piece_material["light"].setSpecular(0.3, 0.3, 0.3, 1);
        this.piece_material["light"].setEmission(0, 0, 0, 1);
        this.piece_material["light"].setShininess(25);
        this.piece_material["light"].setTexture(this.light_piece_texture);
    }

    drawPiece(row, column, color) {
        this.scene.pushMatrix();
            this.scene.translate(this.piece_offset + this.square_size*column, this.board_height, this.piece_offset + this.square_size*row);
            this.piece_material[color].apply();
            this.scene.scale(this.piece_size_ratio, this.piece_size_ratio, this.piece_size_ratio);
            this.piece.display();
        this.scene.popMatrix();
    }

    drawTouchSquares() {
        for (let i = 0; i < 10; ++i) {
            for (let j = 0; j < 10; ++j) {
                this.drawTouchSquare(i, j);
            }
        }
        this.scene.registerForPick(100, null);
    }

    drawTouchSquare(row, column) {
        this.scene.pushMatrix();
            this.scene.translate(this.piece_offset + this.square_size*column, this.board_height + 0.001, this.piece_offset + this.square_size*row);
            this.scene.scale(this.square_size, 1, this.square_size);
            this.scene.registerForPick(row*10 + column, this.touch_square);
            if (this.scene.pickMode) {
                this.touch_square.display();
            }
        this.scene.popMatrix();
    }
}