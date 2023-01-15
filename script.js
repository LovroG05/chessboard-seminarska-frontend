function onChange (oldPos, newPos) {
    console.log('Position changed:')
    console.log('Old position: ' + Chessboard.objToFen(oldPos))
    console.log('New position: ' + Chessboard.objToFen(newPos))
}

var config = {
    position: 'RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr',
    draggable: true,
    onChange: onChange
}
  
  
var board1 = ChessBoard('board1', config);

  
function onLoad() {
    fetch("http://localhost:4567/g/new")
    .then(response => response.text())
    .then(result => {
        console.log(result);
        const obj = JSON.parse(result);
        board1.position(obj.fen);
        $("#uuid").text(obj.uuid);
    })
    .catch(error => console.log('error', error));
}