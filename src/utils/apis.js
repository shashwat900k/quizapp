// calls app.get in server.js to get top 10 scores SQL DB
export function getTopTenScores() {
  return fetch("/getTopTen", {
    method: "GET",
  }).then(function (greetings) {
    return greetings.text();
  })
}

// calls app.post in server.js to store user name and score in SQL DB
export function postUserNameAndScore(objectState){
  fetch("/postNameAndScore", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    mode: "cors",
    cache: "default",
    body: JSON.stringify({
      name: objectState.playerName,
      score: objectState.userScore
    })
  });
};
