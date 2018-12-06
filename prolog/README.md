## Instructions

To start the prolog server, consult the server.pl file and execute `server.`

The server will then listen in port 8081 by default.

## "Endpoints:"

### Init

**Request:**

`/init/:player1difficulty/:player2difficulty`

**Response:**

```
{
    "currp": [PlayerColor, PlayerDif],
    "nextp": [PlayerColor, PlayerDif],
    "board": BoardList,
    "nWhite": nWhitePieces,
    "nBlack": nBlackPieces,
    "nTurns": (starts at 0)
}
```

### Move

**Request:**

`/move/:[Board,NWhite,NBlack,NTurns]/:[CurrColor,CurrDif]/:[NextColor,NextDif]/[X1,Y1,X2,Y2]`

In which [CurrColor,CurrDif] make up the current player, [NextColor,NextDif] make up the next player and [X1,Y1,X2,Y2] make up the desired move.

**Response:**

```
{
    "success": boolean,
    "currp": [Color, Dif],
    "nextp": [Color, Dif],
    "board": BoardList,
    "nWhite": nWhitePieces,
    "nBlack": nBlackPieces,
    "performed_move": [X1, Y1, X2, Y2],
    "game_over": boolean,
    "Winner": 1/2
}
```

In which reason is set if success is false, performed move is set if success is true, and winner is set if game\_over is true.
