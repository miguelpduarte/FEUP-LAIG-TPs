const HOST = "localhost";
const PORT = 8081;

class ComunicationHandler {
    static async initGame(player1_difficulty, player2_difficulty) {
        console.log("Requesting game init");
        return new Promise((resolve, reject) => {
            fetch(`${HOST}:${PORT}/init/${player1_difficulty}/${player2_difficulty}`)
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