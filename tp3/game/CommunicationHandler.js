const HOST = "http://localhost";
const PORT = 8081;
const FULLHOST = `${HOST}:${PORT}`;

class CommunicationHandler {
    static async initGame(player1_difficulty, player2_difficulty) {
        console.log("Requesting game init");

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
}