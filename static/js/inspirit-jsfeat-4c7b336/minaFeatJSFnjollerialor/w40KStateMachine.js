var gameState = "preGame";
var turn = 1;
var i, j;

function stateMachine() {

    switch (gameState) {
        case "preGame":
            //Initial setup
            textGameInfo += "<br><br>Game started!<br><br>0. Pre game (initial setup).";
            //D units setup
            myGamePiece[0].x = 150;
            myGamePiece[0].oldX = 150;
            myGamePiece[0].y = 100;
            myGamePiece[0].oldY = 100;
            myGamePiece[0].angle = 135 * Math.PI / 180;
            myGamePiece[1].x = 270;
            myGamePiece[1].y = 80;
            myGamePiece[1].angle = Math.PI;
            myGamePiece[2].x = 650;
            myGamePiece[2].y = 80;
            myGamePiece[2].angle = Math.PI;
            myGamePiece[3].x = 770;
            myGamePiece[3].y = 100;
            myGamePiece[3].angle = -135 * Math.PI / 180;

            //O Units setup
            myGamePiece[4].x = 150;
            myGamePiece[4].y = 480;
            myGamePiece[4].angle = 35 * Math.PI / 180;
            myGamePiece[5].x = 270;
            myGamePiece[5].y = 500;
            myGamePiece[6].x = 650;
            myGamePiece[6].y = 500;
            myGamePiece[7].x = 770;
            myGamePiece[7].y = 480;
            myGamePiece[7].angle = -35 * Math.PI / 180;

            //Disable and rename buttons to increase playability
            document.getElementById("stateMachine").disabled = true;
            document.getElementById("stateMachine").innerHTML = "Pre Game Done";
            document.getElementById("chosenUnitUDistReset").disabled = true;
            document.getElementById("chosenUnitUDistEnter").disabled = true;
            document.getElementById("chosenUnitODistReset").disabled = true;
            document.getElementById("chosenUnitODistEnter").disabled = true;

            gameState = "setup";
            break;
        case "setup":
            //Update text for move phase
            document.getElementById("helper").innerHTML = "If you want to change the initial setup do so, press small enter button for all units, that will light up the big btn start game";
            document.getElementById("debugVal").innerHTML = textUnitInfo + textGameInfo;
            gameState = "movementPhase";
            break;
        case "movementPhase":
            //Update text for move phase
            document.getElementById("stateMachine").innerHTML = "Movement Phase done";
            document.getElementById("helper").innerHTML = "Move each unit up to it's max move, press small enter button for all units, that will light up the big btn movement phase done";
            document.getElementById("debugVal").innerHTML = textUnitInfo + textGameInfo;
            gameState = "psychPhase";
            break;
        case "psychPhase":
            //disable out not to be used buttons
            document.getElementById("moveUnitReset").disabled = true;
            document.getElementById("moveUnitEnter").disabled = true;
            //enable needed buttons
            //None so far

            //Update text for psych phase
            document.getElementById("stateMachine").innerHTML = "U psych phase done";
            document.getElementById("helper").innerHTML = "Choose power and target, press btn when done";
            gameState = "shootPhase";
            break;
        case "shootPhase":
            //enable needed buttons
            document.getElementById("chosenUnitUDistReset").disabled = false;
            document.getElementById("chosenUnitUDistEnter").disabled = false;
            document.getElementById("chosenUnitODistReset").disabled = false;
            document.getElementById("chosenUnitODistEnter").disabled = false;
            //update text for psych phase
            document.getElementById("stateMachine").innerHTML = "U shoot phase done";
            document.getElementById("helper").innerHTML = "Choose shooting unit and target, press btn when done";
            gameState = 5;
            break;
        default:
        // code block
    }
}