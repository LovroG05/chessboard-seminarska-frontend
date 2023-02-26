function printNextPlayer(playerLetter) {
    if (playerLetter === "w") {
        $("#next").text("WHITE's move");
    } else {
        $("#next").text("BLACK's move");
    }
}

function addToHist(history) {
    ghistory = history;
    $("#hist").empty();
    for (let i = 0; i < history.length; i++) {
        let color = history[i].figure.white ? "White ": "Black ";
        let ox = parseInt(history[i].old_x, 10)+1;
        let oy = parseInt(history[i].old_y, 10)+1;
        let x = parseInt(history[i].new_x)+1;
        let y = parseInt(history[i].new_y)+1;
        $("#hist").append("<li>" + color + history[i].figure.name + " from (" + ox + ", " + oy + ") to ("+ x + ", " + y + ")</li>");
    }
}

function openPromotePawnPopup() {
    $("#myModal").css("display", "block");
}

function openEndGamePopup(status) {
    $("#gamestatusmodal").css("display", "block");
    $("#status").text(status);
    $("#sidebyside").css("filter", "blur(5px)");
}

function promotePawnTo(fen) {
    let move = ghistory[ghistory.length-1];
    let x = move.new_x;
    let y = move.new_y;
    let iswhite = move.isWhites;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "x": x,
        "y": y,
        "isWhite": iswhite,
        "newFigureFEN": fen
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    $("#myModal").css("display", "none");

    fetch("http://localhost:4567/g/"+uuid+"/promote", requestOptions)
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
            if (obj.pawnPromotion) openPromotePawnPopup();
            if (!["RUNNING", "WHITE_CHECK", "BLACK_CHECK"].includes(obj.status)) {
                openEndGamePopup(obj.status);
            }
            $("#stat").text(obj.status);
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
        $("#stat").text(obj.status);
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
var ghistory = "";