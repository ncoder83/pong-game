var fps = 29;
//global width and height
var width, height;

var WINING_SCORE = 3;
//ball position
var bx, by;
var BALL_RADIUS = 10;

//ball acceleration
var ax = 10;
var ay = 10;

//paddle size
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 120;
const OFFSET = 5;
const MARGIN = 35;

//left/right paddle position
var lpx, lpy;
var rpx, rpy;

//scoring system
var p1Score = 0;
var p2Score = 0;

var showWinScreen = false;

//when the dom has finished loading
window.onload = function(){
    setupGameWorld();
    setupEvents();
    GameWorld.render(draw, fps);
};

function setupGameWorld(){
    GameWorld.init();
    var gameInfo = GameWorld.getGameInfo();

    width = gameInfo.width;
    height = gameInfo.height;
    lpx = 0 + OFFSET;
    rpx = width - OFFSET - PADDLE_WIDTH;    
    lpy = rpy = (height/2) - (PADDLE_HEIGHT/2);
    bx = width/2;
    by = height/2;
    Make.init(gameInfo.context);
}

function setupEvents(){
    GameWorld.hook('mousemove', function(evt){
        var mousePos = calculateMousePosition(evt);
        lpy = mousePos.y - (PADDLE_HEIGHT/2);  
    })(GameWorld.getGameInfo().canvas);

    GameWorld.hook('mousedown', mouseClickHandler)(GameWorld.getGameInfo().canvas);
}

function computerMovement(){
    var rpyCenter = rpy + (PADDLE_HEIGHT/2);
    if(rpyCenter < by - MARGIN)
        rpy += 6;
    else if(rpyCenter > by + MARGIN)
        rpy -= 6;    
}

function calculateMousePosition(evt){
    var cvs = GameWorld.getGameInfo().canvas;
    var rect = cvs.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function mouseClickHandler(evt){
    if(showWinScreen){
        p1Score = 0;
        p2Score = 0;
        showWinScreen = false;
    }
}

function resetBall(){
    if(p1Score >= WINING_SCORE || p2Score >= WINING_SCORE){
        showWinScreen = true;
    }
    ax  = -ax;
    
    bx = width/2;
    by = height/2;
}

function draw(){

    computerMovement();
    
    bx += ax;
    by += ay;
  

    
    //boundary check for the ball
    if(bx < 0){// + OFFSET + PADDLE_WIDTH && 
        if(lpy < by && by < lpy + PADDLE_HEIGHT){
            ax = -ax;
            var deltaY = by - (lpy + PADDLE_HEIGHT /2);
            ay = deltaY * 0.35;
        }
        else{
            p2Score++;
            resetBall();
        }
    }

    

    if(bx > width - PADDLE_WIDTH - OFFSET){// - OFFSET - PADDLE_WIDTH && 
        if(rpy < by && by < rpy + PADDLE_HEIGHT){
            ax = -ax;
            var deltaY = by - (rpy + PADDLE_HEIGHT /2);
            ay = deltaY * 0.35;
        }
        else{
             p1Score++;
             resetBall();
        }
    }
    
    
    
    if(by >= height || by <= 0)
        ay = -ay;

    //background black
    Make.color('#222222').rectangle(0,0, width, height);

    if(showWinScreen){
        var txt = "Click to Continue";

        if(p1Score >= WINING_SCORE)
            Make.color('#EFEFEF').text(width/2,height/2, "Left Player Won");
        else if(p2Score >= WINING_SCORE)
            Make.color('#EFEFEF').text(width/2,height/2, "Right Player Won");
        
        Make.color('#EFEFEF').text((width/2) - txt.length/2, height - 100, txt);
        return;
    }


    //left paddle
    Make.color('white').rectangle(lpx, lpy, PADDLE_WIDTH, PADDLE_HEIGHT);
   
    //right paddle
    Make.color('white').rectangle(rpx, rpy, PADDLE_WIDTH, PADDLE_HEIGHT);
    //ball
    Make.color('white').circle(bx, by, BALL_RADIUS);
    //net
    for(var i = 0; i < height; i += 40){
        Make.color('yellow').rectangle(width/2 -1, i, 2, 20);
    }
    //add text
    Make.color('#EFEFEF').text(100, 100, p1Score);
    Make.color('#EFEFEF').text(width - 100, 100, p2Score);
}
  
