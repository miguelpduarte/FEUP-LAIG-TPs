% Requests a type of player from a user
choose_player(Type) :-
    print_options,
    catch(read(Type), _, fail),
    integer(Type),
    valid_difficulty(Type), !.

% The type of player retrieved is invalid
choose_player(Type) :-
    print_wrong, choose_player(Type).

% Text to be printed when a type of player is being picked
print_options :-
    write('Pick one: '), nl,
    write('1 - Human'), nl,
    write('2 - Random Movement'), nl,
    write('3 - Beginner AI'), nl,
    write('4 - Hard AI'), nl.

valid_difficulty(1).
valid_difficulty(2).
valid_difficulty(3).
valid_difficulty(4).

% Message to show when the option inserted is invalid
print_wrong :-
    write('Wrong option, try again'),nl.