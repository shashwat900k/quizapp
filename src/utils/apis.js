export function getTopTenScores() {
  return fetch("/getTopTen", {
    method: "GET",
  }).then(function (greetings) {
    return greetings.text();
  })
}

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
