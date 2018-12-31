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

        this.pieces = [];
        this.highlighted_square = null;

        this.createHighlight();
        this.createTouchSquare();
        this.createBoard();
        this.createPieces();
        this.initMaterials();
    };
    
    display() {
        if (this.scene.pickMode) {
            this.drawTouchSquares();
        }
        
        this.drawPieces();
        this.drawHighlightedSquare();

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
        this.fallback_piece = new Bishop(this.scene, this.createNurbsObject);
    }

    initPieces(board_pieces = []) {
        // In order to handle inits after the first one
        this.pieces = [];

        for (let i = 0; i < board_pieces.length; ++i) {
            for (let j = 0; j < board_pieces[i].length; ++j) {
                // Blank space
                if (board_pieces[i][j] === 0) {
                    continue;
                }
                
                this.pieces.push(new Piece(j, i, board_pieces[i][j] === 1 ? "white" : "black"));
            }
        }
    }

    drawPieces() {
        for (let piece of this.pieces) {
            this.drawPiece(piece);
        }
    }

    initMaterials() {
        this.board_cover_texture = new CGFtexture(this.scene, "primitives/resources/board.jpg");
        this.board_edge_texture = new CGFtexture(this.scene, "primitives/resources/board_edge.jpg");
        this.board_bottom_texture = new CGFtexture(this.scene, "primitives/resources/board_bottom.jpg");
        this.black_piece_texture = new CGFtexture(this.scene, "primitives/resources/black_piece.jpg");
        this.white_piece_texture = new CGFtexture(this.scene, "primitives/resources/white_piece.jpg");
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

        this.highlighted_material = new CGFappearance(this.scene);
        this.highlighted_material.setAmbient(0.15, 0.15, 0, 1);
        this.highlighted_material.setDiffuse(0.5, 0.5, 0, 1);
        this.highlighted_material.setSpecular(0.3, 0.3, 0, 1);
        this.highlighted_material.setEmission(0, 0, 0, 1);
        this.highlighted_material.setShininess(25);

        this.piece_material["black"] = new CGFappearance(this.scene);
        this.piece_material["black"].setAmbient(0.15, 0.15, 0.15, 1);
        this.piece_material["black"].setDiffuse(0.5, 0.5, 0.5, 1);
        this.piece_material["black"].setSpecular(0.3, 0.3, 0.3, 1);
        this.piece_material["black"].setEmission(0, 0, 0, 1);
        this.piece_material["black"].setShininess(25);
        this.piece_material["black"].setTexture(this.black_piece_texture);

        this.piece_material["white"] = new CGFappearance(this.scene);
        this.piece_material["white"].setAmbient(0.15, 0.15, 0.15, 1);
        this.piece_material["white"].setDiffuse(0.5, 0.5, 0.5, 1);
        this.piece_material["white"].setSpecular(0.3, 0.3, 0.3, 1);
        this.piece_material["white"].setEmission(0, 0, 0, 1);
        this.piece_material["white"].setShininess(25);
        this.piece_material["white"].setTexture(this.white_piece_texture);
    }

    drawPiece(piece) {
        this.scene.pushMatrix();
            const piece_to_display = this.getCustomOrFallbackPiece(piece);

            this.scene.translate(this.piece_offset + this.square_size*piece.column, this.board_height + piece.height, this.piece_offset + this.square_size*piece.row);
            this.scene.scale(this.piece_size_ratio, this.piece_size_ratio, this.piece_size_ratio);
            this.scene.registerForPick(piece.row*10 + piece.column, this.fallback_piece);
            piece_to_display.display();
        this.scene.popMatrix();
    }

    getCustomOrFallbackPiece(piece) {
        switch(piece.color) {
            case "white":
                if (this.white_piece) {
                    return this.white_piece;
                } else {
                    this.prepareFallbackPiece(piece);
                    return this.fallback_piece;
                }
            case "black":
                if (this.black_piece) {
                    return this.black_piece;
                } else {
                    this.prepareFallbackPiece(piece);
                    return this.fallback_piece;
                }
            default:
                break;
        }
    }

    prepareFallbackPiece(piece) {
        this.piece_material[piece.color].apply();
    }

    setCustomPieces(white_piece, black_piece) {
        this.white_piece = white_piece;
        this.black_piece = black_piece;
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
            this.touch_square.display();
        this.scene.popMatrix();
    }

    updateAnimations(delta_time) {
        for (let piece of this.pieces) {
            piece.update(delta_time/1e3);
        }
    }

    performMove(origin_row, origin_column, target_row, target_column) {
        let piece = this.getSquarePiece(origin_row, origin_column);
        if (!piece) {
            return;
        }
        piece.setTarget(target_row, target_column);

        // Remove piece if target square has piece
        let target_piece = this.getSquarePiece(target_row, target_column);
        if (target_piece) {
            this.removePiece(target_piece);
        }
    }

    getSquarePiece(row, column) {
        for (let piece of this.pieces) {
            if (piece.row === row && piece.column === column) {
                return piece;
            }
        }
        return null;
    }

    removePiece(piece) {
        if (piece.color === 'black') {
            let num_black_removed_pieces = 25 - GameState.getNrBlack() - 1;
            let row = Math.floor(num_black_removed_pieces/13);
            piece.setTarget(
                -(row + 1.5), 
                -(this.board_margin + this.square_size + 1) + num_black_removed_pieces%13 + (row ? 0.5 : 0)
            );
        } else if (piece.color === 'white') {
            let num_white_removed_pieces = 25 - GameState.getNrWhite() - 1;
            let row = Math.floor(num_white_removed_pieces/13);
            piece.setTarget(
                row + 10.5, 
                -(this.board_margin + this.square_size + 1) + num_white_removed_pieces%13 + (row ? 0.5 : 0)
            );
        }
    }

    undoMove(origin_row, origin_column, target_row, target_column, taken_piece) {
        this.performMove(target_row, target_column, origin_row, origin_column);
        if (taken_piece == 1) {
            let num_white_removed_pieces = 25 - GameState.getNrWhite();
            let row = Math.floor(num_white_removed_pieces/13);
            let piece = this.getSquarePiece(
                row + 10.5,
                -(this.board_margin + this.square_size + 1) + num_white_removed_pieces%13 + (row ? 0.5 : 0)
            );
            piece.setTarget(target_row, target_column);
        } else if (taken_piece == 2) {
            let num_black_removed_pieces = 25 - GameState.getNrBlack();
            let row = Math.floor(num_black_removed_pieces/13);
            let piece = this.getSquarePiece(
                -(row + 1.5),
                -(this.board_margin + this.square_size + 1) + num_black_removed_pieces%13 + (row ? 0.5 : 0)
            );
            piece.setTarget(target_row, target_column);
        }
    }

    createHighlight() {
        this.highlight = new Circle(this.scene, 25);
    }

    setHighlightedSquare(square) {
        this.highlighted_square = square;
    }

    drawHighlightedSquare() {
        if (!this.highlighted_square) {
            return;
        }

        this.scene.pushMatrix();
            this.scene.translate(
                this.piece_offset + this.square_size*this.highlighted_square.column, 
                this.board_height + 0.001, 
                this.piece_offset + this.square_size*this.highlighted_square.row
            );
            this.scene.scale(0.165, 1, 0.165);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.highlighted_material.apply();
            this.highlight.display();
        this.scene.popMatrix();
    }
}