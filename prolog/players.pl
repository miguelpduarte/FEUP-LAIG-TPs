:- use_module(library(random)).
:- use_module(library(lists)).
:- ensure_loaded('movements.pl').
:- ensure_loaded('player_chooser.pl').
:- ensure_loaded('value.pl').

% player(Color that can be moved, Type of player)
% Types of player:
% 1 - Human
% 2 - Random AI
% 3 - Beginner AI
% 4 - Hard AI
initial_player(player(1, Type)) :-
    choose_player(Type).

second_player(player(2, Type)) :-
    choose_player(Type).

is_human(1).
is_random_ai(2).
is_beginner_ai(3).
is_hard_ai(4).

% Returns a random element from a list
get_random_element(List, Element) :-
    length(List, _N),
    random(0, _N, RandN),
    nth0(RandN, List, Element), !.

% Retrieves a movement from a human player
get_move(Type, _Board, move(FromX, FromY, ToX, ToY), _CurrC, _NextC) :-
    is_human(Type), !,
    catch(read(FromX), _, fail), integer(FromX),
    catch(read(FromY), _, fail), integer(FromY),
    catch(read(ToX), _, fail), integer(ToX),
    catch(read(ToY), _, fail), integer(ToY).

% Retrieves a movement from a random ai
get_move(Type, game_state(Board, _NFirst, _NSecond), Mov, CurrC, NextC) :-
    is_random_ai(Type), !,
    findall(Mov2, valid_move(Board, Mov2, CurrC, NextC), ListMoves),
    get_random_element(ListMoves, Mov).

% Retrieves a movement from a beginner ai
get_move(Type, GameState, Mov, CurrC, NextC) :-
    is_beginner_ai(Type), !,
    valid_moves(GameState, CurrC, NextC, ListMoves),
    choose_move(ListMoves, CurrC, _-Mov).

% Retrieves a movement from a hard ai
get_move(Type, GameState, Mov, CurrC, NextC) :-
    is_hard_ai(Type), !,
    compute_minmax_move(GameState, CurrC, NextC, Mov).
    
