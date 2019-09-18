var moveCounter = 0;
var gameSummary = "";

function enterUnitMove() {
    switch (moveCounter) {
        case 0:
            document.getElementById("helper").innerHTML = "Initial setup.";
            break;
        case 1:
            //Update textGameInfo
            textGameInfo += "<br><br>Move Phase " + moveCounter + ": unit U1 moved from "+ myGamePiece[0].oldX + " to x: " + myGamePiece[0].x + " and from " + myGamePiece[0].oldY + " to y: " + myGamePiece[0].y;
            break;
        case 4:
            document.getElementById("stateMachine").disabled = false;
            document.getElementById("stateMachine").innerHTML = "Pre Game Done";
            document.getElementById("moveUnitEnter").disabled = true;
            document.getElementById("helper").innerHTML = "Movement/setup done for all units.";
            moveCounter = 0; //It get's an instant bump to 1 via the ++ at the bottom.
        break;
        default:
    }
    moveCounter++
}

function resetUnitMove() {
    switch (moveCounter) {
        case 0:
            //moveCounter = 3;
            //document.getElementById("stateMachine").disabled = true;
            //document.getElementById("moveUnitEnter").disabled = false;
            break;
        default:
    }
}