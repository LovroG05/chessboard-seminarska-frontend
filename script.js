var webSocket;

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

    webSocket.send(raw);
}

function onLoad() {
    if (!confirm("Se želiš pridružiti igri?")) {
        // start new game
        fetch("http://localhost:4567/g/new")
            .then(response => response.text())
            .then(result => {
                console.log(result);
                const obj = JSON.parse(result);
                board1.position(obj.fen);
                $("#uuid").text(obj.uuid);
                $("#next").text(obj.fen.slice(-1));
                $("#status").text(obj.status);
                document.title = obj.isWhite ? "white": "black";

                webSocket = new WebSocket("ws://localhost:4567/game?uuid="+obj.uuid+"&iswhite="+obj.isWhite);
                webSocket.onmessage = function (msg) {
                    console.log(msg.data)
                    const msgobj = JSON.parse(msg.data);
                    board1.position(msgobj.fen);
                    $("#next").text(msgobj.fen.slice(-1));
                    $("#status").text(msgobj.status);
                };
                webSocket.onclose = function () { alert("WebSocket connection closed") };
            })
            .catch(error => console.log('error', error));
    } else {
        var uuid = prompt("Prosim prilepi UUID");
        // join game
        fetch("http://localhost:4567/g/"+uuid+"/join")
            .then(response => response.text())
            .then(result => {
                console.log(result);
                const obj = JSON.parse(result);
                board1.position(obj.fen);
                $("#uuid").text(obj.uuid);
                $("#next").text(obj.fen.slice(-1));
                $("#status").text(obj.status);
                document.title = obj.isWhite ? "white": "black";

                webSocket = new WebSocket("ws://localhost:4567/game?uuid="+obj.uuid+"&iswhite="+obj.isWhite);
                webSocket.onmessage = function (msg) {
                    console.log(msg.data)
                    const msgobj = JSON.parse(msg.data);
                    board1.position(msgobj.fen);
                    $("#next").text(msgobj.fen.slice(-1));
                    $("#status").text(msgobj.status);
                };
                webSocket.onclose = function () { alert("WebSocket connection closed") };
            })
            .catch(error => console.log('error', error));
    }
}

var config = {
    position: 'start',
    draggable: true,
    onDrop: onDrop
}


var board1 = ChessBoard('board1', config);