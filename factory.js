var Make = (function(){
    var ctx;
    function init(context){
        ctx = context;
    }

    function color(colorname){
        ctx.fillStyle = colorname;
        return this;
    }

    function rectangle(x,y,w,h){
        ctx.fillRect(x, y, w, h);
        return this;
    }

    function square(x, y, s){
        rectangle(x, y, s, s);
        return this;
    }

    function ellipse(x, y, rx, ry){
        ctx.beginPath();
        ctx.arc(x, y, rx, ry, 2* Math.PI, true);
        ctx.fill();
        return this;
    }

    function circle(x, y, r){
        ellipse(x, y, r, 0);
        return this;
    }
    return {
        init:init,
        color:color,
        rectangle:rectangle,
        square: square,
        ellipse: ellipse,
        circle: circle
    };
})()