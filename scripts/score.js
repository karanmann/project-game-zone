var fireBaseref = new firebase("https://star-wars-game-da369-default-rtdb.europe-west1.firebasedatabase.app");

function save (){
  var newScore = {};
  newScore.name = document.getElementById("name").value;
  newScore.score = document.getElementById("score").value;
  fireBaseref.set(newScore);
}
