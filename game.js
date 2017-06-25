var GameWorld = (function(){
    
    var canvas;
    var context;
    var fps = 10;
    function init(){
        canvas = document.getElementById('gameCanvas');
        context = canvas.getContext('2d');
        drawbackground('black');
    }

    function getGameInfo(){
        return {
            canvas: canvas,
            context:context,
            width: canvas.width,
            height: canvas.height
        };
    }


    function getGameContext(){
        if(context)
            return context;
        else
            throw "Canvas Context not defined";
    }

    function getGameCanvas(){
        if(canvas)
            return canvas;
        else
            throw "Canvas not defined";
    }

    function render(cb, framerate){
        var currentFPS = framerate || fps;
        setInterval(cb, 1000/currentFPS);
    }

    function hook(eventName, cb){
        return function(control){
            return control.addEventListener(eventName, cb);
        }
    }

    function drawbackground(color){
        if(context){
            context.fillStyle = color;
            context.fillRect(0,0,canvas.width, canvas.height);
        }
    }

    return {
        init: init,
        render: render,
        hook:hook,
        getGameInfo:getGameInfo,
        getGameContext: getGameContext,
        getGameCanvas: getGameCanvas
    };
})();


