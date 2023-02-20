function printNextPlayer(playerLetter) {
    if (playerLetter === "w") {
        $("#next").text("WHITE's move");
    } else {
        $("#next").text("BLACK's move");
    }
}

function addToHist(history) {
    $("#hist").empty();
    for (let i = 0; i < history.length; i++) {
        let color = history[i].figure.white ? "White ": "Black ";
        $("#hist").append("<li>" + color + history[i].figure.name + " from (" + history[i].old_x + ", " + history[i].old_y + ") to ("+ history[i].new_x + ", " + history[i].new_y + ")</li>")
    }
}


function onDrop (source, target, piece, newPos, oldPos, orientation) {
    console.log('Source: ' + source)
    console.log('Target: ' + target)
    console.log('Piece: ' + piece)
    console.log('New position: ' + Chessboard.objToFen(newPos))
    console.log('Old position: ' + Chessboard.objToFen(oldPos))
    console.log('Orientation: ' + orientation)
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "source": source,
        "target": target,
        "piece": piece,
        "orientation": orientation
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };


    fetch("http://localhost:4567/g/"+ uuid +"/move", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            const obj = JSON.parse(result);
            board1.position(obj.fen);
            printNextPlayer(obj.fen.slice(-1));
            addToHist(obj.history);
        })
        .catch(error => console.log('error', error));
}

function onLoad() {
    fetch("http://localhost:4567/g/new")
    .then(response => response.text())
    .then(result => {
        console.log(result);
        const obj = JSON.parse(result);
        board1.position(obj.fen);
        printNextPlayer(obj.fen.slice(-1));
        uuid = obj.uuid;
    })
    .catch(error => console.log('error', error));
}

var config = {
    position: 'start',
    draggable: true,
    onDrop: onDrop
}
  
  
var board1 = ChessBoard('board1', config);
var uuid = "";
