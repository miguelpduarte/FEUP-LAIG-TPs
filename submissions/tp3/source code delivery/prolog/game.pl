:- use_module(library(system)).
:- ensure_loaded('board.pl').
:- ensure_loaded('players.pl').
:- ensure_loaded('value.pl').

% Verifies if player 2 has won
game_over(game_state(_Board, 0, _NSecond), 2) :- !.

% Verifies if player 1 has won
game_over(game_state(_Board, _NFirst, 0), 1) :- !.

% initial_board(_B), game_over(_B, W).
% victory_board(_B), game_over(_B, W).
% victory_game_state(GS), game_over(GS, Winner).

% Starts a new game
start_game :- 
    now(TS),
    setrand(TS),
    initial_game_state(S),
    initial_player(P1),
    second_player(P2),
    play_game(S, P1, P2, 0).

% Diplays the victory message
display_winner(Winner) :- 
    write('Player '), write(Winner), write(' won!'), nl, fail.

% Displays the invalid move option
display_invalid_move :-
    write('Invalid move try again!'), nl.

% Game step:  Verifies if the game has ended
play_game(game_state(Board, NFirst, NSecond), CurrP, _NextP, NTurns) :-
    display_game(Board, CurrP, NTurns), print_value(game_state(Board, NFirst, NSecond)),
    game_over(game_state(Board, NFirst, NSecond), Winner), !,
    display_winner(Winner).
    
% victory_board(_B), play_game(_B,1,2).

% Game State: Requests input from the players
play_game(GameState, player(CurrC, CurrType), player(NextC, NextType), NTurns) :-
    get_move(CurrType, GameState, Mov, CurrC, NextC),
    write(Mov), nl,
    move(GameState, Mov, NewGameState, CurrC, NextC), !,
    NTurns2 is NTurns + 1,
    play_game(NewGameState, player(NextC, NextType), player(CurrC, CurrType), NTurns2).

% Game State: Desired move is invalid
play_game(GameState, CurrP, NextP, NTurns) :-
    display_invalid_move, !, play_game(GameState, CurrP, NextP, NTurns).