:- use_module(library(lists)).
:- use_module(library(between)).

initial_board([
        [0,1,0,1,0,1,0,1,0,1],
        [2,0,2,0,2,0,2,0,2,0],
        [0,1,0,1,0,1,0,1,0,1],
        [2,0,2,0,2,0,2,0,2,0],
        [0,1,0,1,0,1,0,1,0,1],
        [2,0,2,0,2,0,2,0,2,0],
        [0,1,0,1,0,1,0,1,0,1],
        [2,0,2,0,2,0,2,0,2,0],
        [0,1,0,1,0,1,0,1,0,1],
        [2,0,2,0,2,0,2,0,2,0]
    ]) :- !.

initial_piece_numbers(25, 25) :- !.

initial_game_state(game_state(Board, NFirst, NSecond)) :-
    initial_board(Board),
    initial_piece_numbers(NFirst, NSecond).

victory_board([
    [0,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]) :- !.

victory_game_state(game_state(Board, 1, 0)) :-
    victory_board(Board).

oversize([
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1],
    [0,1,0,2,0,1,0,2,0,1,1,1,1,1,1,1]
])  :- !.

% Value of an empty cell
emptyCell(0).

% cell(Value on the board, 
%      Spacer to the left, 
%      Code to be printed, 
%      Spacer to the right).
cell(0, '  ', 32,'  ').
cell(1, '  ', 9632, '  ').
cell(2, '  ', 9633, '  ').
cell(X, '  ', X, '  ').

% Cell's horizontal divider.
separator('_____|').

% Space between the cell value and the cell's horizontal divider.
space_separator('     |').

% Prints a cell horizontal separator followed by a space separator
print_separator(SizeOfTheSeparator) :-
    write('___|'),
    print_separator2(SizeOfTheSeparator), nl,
    write('   |'),
    print_space_separator(SizeOfTheSeparator), nl, !.

% Base case: When the size is 0, there nothong more to print.
print_separator2(0).

% Prints a separator of size SizeOfTheSeparator cells.
print_separator2(SizeOfTheSeparator) :-
    SizeOfTheSeparator > 0,
    separator(_X), write(_X),
    MissingSeparators is SizeOfTheSeparator - 1,
    print_separator2(MissingSeparators), !.

% Base case: When the size is 0, there nothong more to print.
print_space_separator(0).

% Prints a separator of size SizeOfTheSeparator cells.
print_space_separator(SizeOfTheSeparator) :-
    SizeOfTheSeparator > 0,
    space_separator(_X), write(_X),
    MissingSeparators is SizeOfTheSeparator - 1,
    print_space_separator(MissingSeparators), !.

% Prints the column's numbers.
print_column_numbers(N) :-
    write('   |'),
    print_column_numbers2(N), nl, !.

% Base case: There is no more numbers left to print.
print_column_numbers2(0).

% Prints the column numbers from 0 To N - 1
print_column_numbers2(N) :-
    N1 is N - 1,
    print_column_numbers2(N1),
    write_number(N1), !.

% Prints a collumn number with the correct spacing.
write_number(ColumnNumber) :-
    ColumnNumber < 10,
    write('  '), write(ColumnNumber), write('  |'), !.

% Prints a collumn number with the correct spacing.
write_number(ColumnNumber) :-
    ColumnNumber >= 10,
    write('  '), write(ColumnNumber), write(' |'), !.

% Base case: An empty list has size 0.
size_list([], 0).

% Determines the size of a list.
size_list([_ | Tail], Size) :-
    size_list(Tail, SizeOfTail),
    Size is SizeOfTail + 1, !.

% Prints the board.
print_board([HeadOfTheBoard | TailOfTheBoard]) :-
    nl,
    size_list(HeadOfTheBoard, NumberOfColumns),
    print_column_numbers(NumberOfColumns),
    print_separator(NumberOfColumns),
    print_board2([HeadOfTheBoard | TailOfTheBoard], 0, NumberOfColumns), !.

% Base case: The board is empty.
print_board2([], _, _).
% Prints the body of the board.
print_board2([HeadOfTheBoard | TailOfTheBoard], LineNumber, NumberOfColumns) :- 
    print_line_number(LineNumber),
    print_line(HeadOfTheBoard), nl,
    print_separator(NumberOfColumns),
    NextLineNumber is LineNumber + 1,
    print_board2(TailOfTheBoard, NextLineNumber, NumberOfColumns), !.

% Prints a line number with the correct spacing.
print_line_number(LineNumber) :-
    LineNumber < 10,
    write(' '), write(LineNumber), write(' '), !.

% Prints a line number with the correct spacing.
print_line_number(LineNumber) :-
    LineNumber >= 10,
    write(' '), write(LineNumber), !.

% Prints a line of the board.
print_line(BoardLine) :-
    write('|'),
    print_line2(BoardLine), !.

% Base case: The line is empty.
print_line2([]).
% Prints a line of the board.
print_line2([FirstCell|LineTail]) :-
    cell(FirstCell, PrevSpacer, CodeToPrint, NextSpacer), 
    write(PrevSpacer),
    put_code(CodeToPrint),
    write(NextSpacer),
    write('|'),
    print_line2(LineTail), !.

% Prints a player.
print_player(Player) :-
    write('Player '),
    write(Player),
    write('\'s turn'), !.

% Prints the current turn number
print_nturns(NTurns) :-
    write('Turn #'),
    write(NTurns),
    write(':'), !.

% Displays a game.
display_game(_Board, Player, NTurns) :-
    print_nturns(NTurns), nl,
    print_player(Player), nl,
    print_board(_Board).

% Verifies if exists a cell with coordinates X,Y inside
% the board.
inside_board([BoardH | BoardT], X, Y) :-
    length(BoardH, BoardLenYFull),
    BoardLenY is BoardLenYFull - 1,
    between(0, BoardLenY, Y),
    length(BoardT, BoardLenX),
    between(0, BoardLenX, X).

% Tests that were made.
% initial_board(B) , print_board(B).
% inter_board(B) , print_board(B).
% victory_board(B) , print_board(B).
% oversize(B) , print_board(B).
% initial_board(_B), inside_board(_B, 2, 2).
% oversize(_B), inside_board(_B, 2, Y).