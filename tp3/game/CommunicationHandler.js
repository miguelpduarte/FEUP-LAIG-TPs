const HOST = "http://localhost";
const PORT = 8081;
const FULLHOST = `${HOST}:${PORT}`;

class CommunicationHandler {
    static async initGame(player1_difficulty, player2_difficulty) {
        return new Promise((resolve, reject) => {
            fetch(`${FULLHOST}/init/${player1_difficulty}/${player2_difficulty}`)
                .then(res => res.json())
                .then(data => {
                    console.log("Received init data:", data);
                    if (data.success) {
                        return resolve(data);
                    } else {
                        return reject(data.reason);
                    }
                })
                .catch(err => console.log("fetch error:", err));
        });
    }

    // Destructuring the state to simplify code, and adding the "parsed" move after
    static async movePiece({board, nWhite, nBlack, nTurns, currp, nextp}, requested_move) {
        const request_url = `move/[${JSON.stringify(board)},${nWhite},${nBlack},${nTurns}]/[${currp}]/[${nextp}]/[${requested_move}]`;

        return new Promise((resolve, reject) => {
            fetch(`${FULLHOST}/${request_url}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        return resolve(data);
                    } else {
                        return reject(data.reason);
                    }
                })
                .catch(err => console.log("fetch error:", err));
        });
    }

    // Destructuring the state to simplify code
    static async aiMovePiece({board, nWhite, nBlack, nTurns, currp, nextp}) {
        const request_url = `calcmove/[${JSON.stringify(board)},${nWhite},${nBlack},${nTurns}]/[${currp}]/[${nextp}]`;

        // console.log(request_url);

        return new Promise((resolve, reject) => {
            fetch(`${FULLHOST}/${request_url}`)
                .then(res => res.json())
                .then(data => {
                    console.log("ai res", data);
                    if (data.success) {
                        return resolve(data);
                    } else {
                        return reject(data.reason);
                    }
                })
                .catch(err => console.log("fetch error:", err));
        });
    }
}