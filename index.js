var fps = 29;
//global width and height
var width, height;

//ball position
var bx, by;
var BALL_RADIUS = 10;

//ball acceleration
var ax = 5;
var ay = 5;

//paddle size
var PADDLE_WIDTH = 20;
var PADDLE_HEIGHT = 120;
var OFFSET = 10;

//left/right paddle position
var lpx, lpy;
var rpx, rpy;

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
}

function computerMovement(){
    
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

function resetBall(){
    ax  = -ax;
    bx = width/2;
    by = height/2;
}

function draw(){
    bx = bx + ax;
    by = by + ay;

    //boundary check for the ball
    if(bx >= width || bx <= 0){
        if(by > lpy && by < lpy + PADDLE_HEIGHT ||
           by > rpy && by < rpy + PADDLE_HEIGHT){
            ax = -ax;
        }
        else{
            resetBall();
        }
    }
    
    if(by >= height || by <= 0)
        ay = -ay;

    
    //background black
    Make.color('#222222').rectangle(0,0, width, height);
    //left paddle
    Make.color('white').rectangle(lpx, lpy, PADDLE_WIDTH, PADDLE_HEIGHT);
    //right paddle
    Make.color('white').rectangle(rpx, rpy, PADDLE_WIDTH, PADDLE_HEIGHT);
    //ball
    Make.color('#89cff0').circle(bx, by, BALL_RADIUS);



}
  
