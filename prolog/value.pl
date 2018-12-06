:- ensure_loaded('board.pl').
:- ensure_loaded('movements.pl').
:- dynamic evaluate_board_depth/5.
:- dynamic evaluate_board/2.

evaluate_board(GameState, Value) :-
    game_over(GameState, Player), !,
    win_value(Player, Value).

evaluate_board(game_state(Board, _NFirst, _NSecond), Value) :-
    evaluate_board2(Board, V),
    % Ensures that each piece is accounted for only once
    Value is V - 2 * _NFirst + 2 * _NSecond,
    asserta((evaluate_board(Board, Value) :- !)),!.

evaluate_board2(Board, Value) :-
    % Top Diagonals going to the lower left and to the lower right
    evaluate_top(Board, Acc1, 0, 1),
    % Left and right limits of the board - diagonals going to the lower opposite side
    length(Board, FullBoardSize),
    BoardSize is FullBoardSize - 1,
    evaluate_sides(Board, Acc2, 0, 1, BoardSize),
    % Summing the total board value
    Value is Acc1 + Acc2.


evaluate_sides(Board, Acc, Acc, X, _LengthMinusOne) :-
    \+ inside_board(Board, X, 0), !.

evaluate_sides(Board, Value, Acc, X, LengthMinusOne) :-
    evaluate_diagonal(Board, X, 0, 1, 1, LeftSide),
    evaluate_diagonal(Board, X, LengthMinusOne, 1, -1, RightSide),
    Acc2 is LeftSide + RightSide + Acc,
    X2 is X + 2,
    evaluate_sides(Board, Value, Acc2, X2, LengthMinusOne).


evaluate_top(Board, Acc, Acc, Y) :-
    \+ inside_board(Board, 0, Y), !.

evaluate_top(Board, Value, Acc, Y) :-
    evaluate_diagonal(Board, 0, Y, 1, 1, LowerRightVal),
    evaluate_diagonal(Board, 0, Y, 1, -1, LowerLeftVal),
    Acc2 is LowerRightVal + LowerLeftVal + Acc,
    Y2 is Y + 2,
    evaluate_top(Board, Value, Acc2, Y2).

% evaluate_diagonal(+Board, +StartX, +StartY, +DeltaX, +DeltaY, -Value)
evaluate_diagonal(Board, StartX, StartY, DeltaX, DeltaY, Value) :-
    evaluate_diagonal(Board, StartX, StartY, DeltaX, DeltaY, Value, 0, 0).

% evaluate_diagonal/6's auxilliar predicate
% evaluate_diagonal(+Board, +X, +Y, +DeltaX, +DeltaY, -Value, +ValueSum, +NPieces)

% Base case, finished going through diagonal
evaluate_diagonal(Board, X, Y, _DeltaX, _DeltaY, Value, ValueSum, NPieces) :-
    \+ inside_board(Board, X, Y), !,
    Value is ValueSum * NPieces.

evaluate_diagonal(Board, X, Y, DeltaX, DeltaY, Value, ValueSum, NPieces) :-
    get_piece(Board, X, Y, Piece),
    get_value(Piece, PValue),
    ValueSum2 is ValueSum + PValue,
    NPieces2 is NPieces + abs(PValue),
    X1 is X + DeltaX,
    Y1 is Y + DeltaY,
    evaluate_diagonal(Board, X1, Y1, DeltaX, DeltaY, Value, ValueSum2, NPieces2).
    
%% initial_game_state(_GS), evaluate_board(_GS, Val)

get_value(0,0).
get_value(1,1).
get_value(2,-1).

win_value(1, 1000).
win_value(2, -1000).

print_value(GameState) :-
    evaluate_board(GameState, Value),
    write('Value '), write(Value), nl.

% compute_minmax_moves(+Board, +CurrC, +NextC, -Move)
compute_minmax_move(GameState, CurrC, NextC, BestMove) :-
    valid_moves(GameState, CurrC, NextC, FirstDepthList),
    % In order to start computing the best move, the current best move value is the worst move value for this player - enemy win
    % This is so that the CurrBestMove is replaced straight away, and so that the initial value of this variable does not matter
    win_value(NextC, WorstValue),
    compute_move_tree(FirstDepthList, CurrC, NextC, BestMove, move(0, 0, 0, 0), WorstValue).

% If a winning move was found, collapse the move search tree
compute_move_tree([FirstDepthMove-FirstDepthGameState | _FirstDepthT], CurrC, _NextC, FirstDepthMove, _CurrBestMove, _CurrBestValue) :-
    game_over(FirstDepthGameState, CurrC), !.

% Base case, finished the possible moves list
compute_move_tree([], _CurrC, _NextC, BestMove, BestMove, _Value) :- !.

% If a new best move was found, update the current best
compute_move_tree([FirstDepthMove-FirstDepthGameState | FirstDepthT], CurrC, NextC, _BestMove, _CurrBestMove, CurrBestValue) :-
    valid_values(FirstDepthGameState, NextC, CurrC, ValuesList),
    best_value(ValuesList, NextC, LowerDepthBestValue),
    better_than_current(CurrBestValue, LowerDepthBestValue, CurrC), !,
    compute_move_tree(FirstDepthT, CurrC, NextC, _BestMove, FirstDepthMove, LowerDepthBestValue).

% If a new best move was not found, simply continue
compute_move_tree([_FirstDepthH | FirstDepthT], CurrC, NextC, _BestMove, CurrBestMove, CurrBestValue) :-
    compute_move_tree(FirstDepthT, CurrC, NextC, _BestMove, CurrBestMove, CurrBestValue).

% Deciding if a value is better that the current best value, based on the current color

better_than_current(CurrBest, CandidateValue, _Color) :-
    CurrBest =:= CandidateValue , !, 
    random(0, 2, 1).

better_than_current(CurrBest, CandidateValue, Color) :-
    Color is 1, !,
    CandidateValue > CurrBest.

better_than_current(CurrBest, CandidateValue, Color) :-
    Color is 2, !,
    CandidateValue < CurrBest.

% Retrieving the best move value for each color, from a value list

best_value(ValuesList, Color, BestValue) :-
    Color is 1, !,
    max_member(BestValue, ValuesList).

best_value(ValuesList, Color, BestValue) :-
    Color is 2, !,
    min_member(BestValue, ValuesList).

valid_values(GameState, CurrColor, NextColor, ListOfValues) :- 
    findall(Value, (move(GameState, _Movement, NewGameState, CurrColor, NextColor), evaluate_board(NewGameState, Value)), ListOfValues).


%%%%%%
choose_move([MovesHMov-MovesHState | MovesT], CurrC, Mov) :-
    CurrC is 2, !,
    evaluate_board(MovesHState, Value),
    choose_move_second(MovesT, Mov, Value-MovesHMov).

choose_move([MovesHMov-MovesHState | MovesT], CurrC, Mov) :-
    CurrC is 1, !,
    evaluate_board(MovesHState, Value),
    choose_move_first(MovesT, Mov, Value-MovesHMov).

choose_move_second([], Value-Mov, Value-Mov).

choose_move_second([MovesHMov-MovesHState | MovesT], BestMov, CurrBestValue-_CurrBestMov) :-
    evaluate_board(MovesHState, Value),
    Value < CurrBestValue, ! ,
    choose_move_second(MovesT, BestMov, Value-MovesHMov).

choose_move_second([MovesHMov-MovesHState | MovesT], BestMov, CurrBestValue-CurrBestMov) :-
    evaluate_board(MovesHState, Value),
    Value =:= CurrBestValue, ! ,
    random_move(CurrBestMov, MovesHMov, Mov),
    choose_move_second(MovesT, BestMov, Value-Mov).

choose_move_second([_ | MovesT], BestMov, CurrBestValue-CurrBestMov) :-
    choose_move_second(MovesT, BestMov, CurrBestValue-CurrBestMov).

choose_move_first([], Value-Mov, Value-Mov).

choose_move_first([MovesHMov-MovesHState | MovesT], BestMov, CurrBestValue-_CurrBestMov) :-
    evaluate_board(MovesHState, Value),
    Value > CurrBestValue, ! ,
    choose_move_first(MovesT, BestMov, Value-MovesHMov).


choose_move_first([MovesHMov-MovesHState | MovesT], BestMov, CurrBestValue-CurrBestMov) :-
    evaluate_board(MovesHState, Value),
    Value =:= CurrBestValue, ! ,
    random_move(CurrBestMov, MovesHMov, Mov),
    choose_move_first(MovesT, BestMov, Value-Mov).

choose_move_first([_ | MovesT], BestMov, CurrBestValue-CurrBestMov) :-
    choose_move_first(MovesT, BestMov, CurrBestValue-CurrBestMov).

random_move(Mov1, _Mov2, MovOut) :-
    random(0, 2, 0), !, MovOut = Mov1.

random_move(_Mov1, Mov2, Mov2).