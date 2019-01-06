:- ensure_loaded('board.pl').
:- use_module(library(lists)).
:- dynamic valid_moves/4.

% Returns the value of a piece in the coordinates (X,Y)
get_piece(Board, X, Y, Piece) :- 
    nth0(X, Board, _BoardRow),
    nth0(Y, _BoardRow, Piece).

% Base case: Needs to modify the line at the head of the list
set_piece([BoardH | BoardT], X, Y, NewValue, [NewBoardH | BoardT]) :-
    X is 0, !, 
    set_piece_row(BoardH, Y, NewValue, NewBoardH).

% It didn't reach the desired line, so it moves to the next one
set_piece([BoardH | BoardT], X, Y, NewValue, [BoardH | NewBoardT]) :-
    X1 is (X - 1),
    set_piece(BoardT, X1, Y, NewValue, NewBoardT).

% Base case: Mofifies the piece at the head of the list
set_piece_row([_BoardH | BoardT], Y, NewValue, [NewValue | BoardT]) :- 
    Y is 0, !.

% It didn't reach the desired piece, so it moves to the next one
set_piece_row([BoardH | BoardT], Y, NewValue, [BoardH | NewBoardT]) :- 
    Y1 is (Y - 1),
    set_piece_row(BoardT, Y1, NewValue, NewBoardT).

% Returns all valid movements for a given game state
valid_moves(GameState, CurrColor, NextColor, ListOfMoves) :- 
    findall(Movement-NewGameState, move(GameState, Movement, NewGameState, CurrColor, NextColor), ListOfMoves),
    asserta((valid_moves(GameState, CurrColor, NextColor, ListOfMoves) :- !)).

% Modifies the game state based on the movement provided
move(game_state(Board, NFirst, NSecond), Mov, NewGameState, CurrC, NextC):-
    valid_move(Board, Mov, CurrC, NextC),
    move_piece(game_state(Board, NFirst, NSecond), NewGameState, Mov).

% Moves a piece from a place to another and modifies the game state accordingly
move_piece(game_state(Board, NFirst, NSecond), game_state(NewBoard, NewNFirst, NewNSecond), move(FromX, FromY, ToX, ToY) ) :-
    get_piece(Board, FromX, FromY, _P),
    emptyCell(_Empty),
    set_piece(Board, FromX, FromY, _Empty, _TmpBoard),
    set_piece(_TmpBoard, ToX, ToY, _P, NewBoard),
    get_new_state(game_state(Board, NFirst, NSecond), NewNFirst, NewNSecond, ToX, ToY).

% Modifies the number of pieces when piece from the first player was taken
get_new_state(game_state(Board, NFirst, NSecond), NewNFirst, NSecond, ToX, ToY) :-
    get_piece(Board, ToX, ToY, 1), !,
    NewNFirst is NFirst - 1.
    
% Modifies the number of pieces when piece from the second player was taken
get_new_state(game_state(Board, NFirst, NSecond), NFirst, NewNSecond, ToX, ToY) :-
    get_piece(Board, ToX, ToY, 2), !,
    NewNSecond is NSecond - 1.

% Keeps the number of pieces when no piece was taken
get_new_state(game_state(_Board, NFirst, NSecond), NFirst, NSecond, _ToX, _ToY).

% Verifies if a movement is valid for a given player
valid_move(Board, Mov, CurrC, NextC) :- 
    valid_kill(Board, Mov, CurrC, NextC).

valid_move(Board, Mov, CurrC, NextC) :- 
    valid_engage(Board, Mov, CurrC, NextC).

% Verifies if the movement is a valid engage
valid_engage(Board, move(FromX, FromY, ToX, ToY), J, NxtJ) :-
    inside_board(Board, FromX, FromY),
    inside_board(Board, ToX, ToY),
    is_diagonal(move(FromX, FromY, ToX, ToY)),
    \+ valid_kill(Board, move(FromX, FromY, _X, _Y), J, NxtJ),
    emptyCell(_Empty), get_piece(Board, ToX, ToY, _Empty),
    get_piece(Board, FromX, FromY, J),
    empty_space(Board, move(FromX, FromY, ToX, ToY)),
    valid_kill(Board, move(ToX, ToY, _X2, _Y2), _Empty, NxtJ).     

% Verifies if the movement is a valid kill
valid_kill(Board, move(FromX, FromY, ToX, ToY), J, NxtJ) :-
    inside_board(Board, FromX, FromY),
    inside_board(Board, ToX, ToY),
    is_diagonal(move(FromX, FromY, ToX, ToY)),
    get_piece(Board, FromX, FromY, J),
    get_piece(Board, ToX, ToY, NxtJ),
    empty_space(Board, move(FromX, FromY, ToX, ToY)).

% Verifies if a movement is diagonal
is_diagonal(move(FromX, FromY, ToX, ToY)) :-
    AbsDifX is abs(ToX - FromX),
    AbsDifY is abs(ToY - FromY),
    AbsDifX =:= AbsDifY.

% Determines in which direction is the movement
get_delta(move(FromX, FromY, ToX, ToY), DeltaX, DeltaY) :-
    DeltaX is sign(ToX - FromX),
    DeltaY is sign(ToY - FromY).

% Verifies if there is empty space between the origin and detination of the movement
empty_space(Board, move(FromX, FromY, ToX, ToY)) :-
    get_delta(move(FromX, FromY, ToX, ToY), DeltaX, DeltaY), !,
    FromX2 is FromX + DeltaX,
    FromY2 is FromY + DeltaY,
    empty_space_delta(Board, move(FromX2, FromY2, ToX, ToY), DeltaX, DeltaY).

% Base Case: There is empty space between a position and itself
empty_space_delta(_Board, move(X, Y, X, Y), _DeltaX,  _DeltaY).

% Checks if the current coordinates are empty and calls recursively for the next cells
empty_space_delta(Board, move(CurrX, CurrY, ToX, ToY), DeltaX, DeltaY) :-
    emptyCell(_Empty), get_piece(Board, CurrX, CurrY, _Empty), !,
    CurrX2 is CurrX + DeltaX,
    CurrY2 is CurrY + DeltaY,
    empty_space_delta(Board, move(CurrX2, CurrY2, ToX, ToY), DeltaX, DeltaY).



% initial_board(_X), set_piece(_X, 1, 1, 2, _Y), print_board(_Y).
% initial_board(_X), move(_X, _Y, 0, 1, 1, 0), print_board(_Y).
% inter_board(_X), empty_space(_X, move(0, 1, 4, 5)).
% yes
% initial_board(_X), empty_space(_X, move(0, 1, 4, 5)).
% no
% inter_board(_X), valid_kill(_X, move(0, 1, 4, 5), 1, 2).
% no
% inter_board(_X), valid_kill(_X, move(4, 5, 0, 1), 1, 2).
% yes
% inter_board(_X), valid_kill(_X, move(5, 5, 0, 1), 1, 2).
% no
% inter_board(_X), valid_engage(_X, move(4, 7, 5, 6), 2, 1).
% yes
% inter_board(_X), valid_move(_X, move(4, 7, 5, 6), 2, 1).
% yes
% inter_board(_X), valid_move(_X, move(4, 5, 0, 1), 1, 2).
% yes