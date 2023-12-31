var myGamePiece;
var myObstacles = [];
var myScore;
var messageElement;
var resetButton;

function startGame() {
    myGamePiece = new component(30, 30, "goat.png", 10, 120);
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    messageElement = document.getElementById("message");
    resetButton = document.getElementById("resetButton");
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function(e) {
            if (e.keyCode === 32 && !myGameArea.resetKeyPressed) {
                accelerate(-0.2);
            }
        });
        window.addEventListener('keyup', function(e) {
            if (e.keyCode === 32) {
                accelerate(0.05);
            }
        });
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    },
    resetKeyPressed: false
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;        
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (this == myGamePiece){
            var img = new Image();
            img.src = color;
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        }
        
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }


    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
        this.hitTop(); 
    }
    this.hitTop = function() {
        var rocktop = 0;  
        if (this.y < rocktop) {
          this.y = rocktop;
          this.gravitySpeed = 0; 
        }
      }

    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if (
            mybottom < othertop ||
            mytop > otherbottom ||
            myright < otherleft ||
            myleft > otherright
        ) {
            crash = false;
        }
        return crash;
    }
}

var speedIncrease = 0;

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            messageElement.innerText = "You have failed! Game Over";
            messageElement.style.display = "block";
            resetButton.style.display = "block";
            return;
        }
    }
    myGameArea.clear();

    if (myGameArea.frameNo % 100 === 0) {
        speedIncrease += 0.2;
    }


    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].speedX = -1 - speedIncrease;
    }

    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += myObstacles[i].speedX; 
        myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}


function accelerate(n) {
    myGamePiece.gravity = n;
}

function resetGame() {
    messageElement.style.display = "none";
    resetButton.style.display = "none";
    myGameArea.resetKeyPressed = true;
    myGamePiece = null;
    myObstacles = [];
    myScore = null;
    myGameArea.clear();
    myGameArea.frameNo = 0;
    myGameArea.resetKeyPressed = false;
    startGame();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}
