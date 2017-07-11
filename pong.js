class Vec{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
    get len(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set len(value){
        const fact = value / this.len;
        this.x *= fact;
        this.y *= fact;
    }
}

class Rect{
    constructor(w,h){
        this.pos = new Vec;
        this.size = new Vec(w,h);
    }

    get left(){
        return this.pos.x - this.size.x/2;
    }
    get right(){
        return this.pos.x + this.size.x/2;
    }
    get top(){
        return this.pos.y - this.size.y/2;
    }
    get bottom(){
        return this.pos.y + this.size.y/2;
    }
}

class Ball extends Rect{
    constructor(){
        super(10,10);
        this.vel = new Vec;
    }
}


class Player extends Rect{
    constructor(){
        super(20,100);
        this.score = 0;
    }
}
class Pong {
    constructor(canvas){
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.ball = new Ball;
        this.ball.pos.x = 100;
        this.ball.pos.y = 50;

        this.ball.vel.x = 300;
        this.ball.vel.y = 300;

        this.players = [
            new Player,
            new Player
        ];

        this.players[0].pos.x = 40;
        this.players[1].pos.x = this._canvas.width - 40;
        this.players.forEach(p => {
            p.pos.y = this._canvas.height/2;
        });
        let lastTime;
        const callback = (millis) => {
            if(lastTime){
                this.update((millis - lastTime)/1000);
            }
            lastTime = millis;
            requestAnimationFrame(callback);
        };
        callback();
        this.NUMBER_PIXEL = 10;
        this.NUMBERS = [
            '111101101101111', //0
            '010010010010010', //1
            '111001111100111', //2
            '111001111001111', //3 
            '101101111001001', //4
            '111100111001111', //5
            '111100111101111', //6
            '111001001001001', //7
            '111101111101111', //8
            '111101111001111'  //9
        ].map(str => {
            const canvas = document.createElement('canvas');
            canvas.height = this.NUMBER_PIXEL * 5;
            canvas.width = this.NUMBER_PIXEL * 3;
            const context = canvas.getContext('2d');
            context.fillStyle = '#FFF';
            str.split('').forEach((fill, i) =>{
                if(fill === '1'){
                    context.fillRect((i % 3) * this.NUMBER_PIXEL, 
                                     (i / 3 | 0) * this.NUMBER_PIXEL,
                                     this.NUMBER_PIXEL, this.NUMBER_PIXEL);
                }
            });
            return canvas;
        })
        this.reset();
    }
    collide(player, ball){
        if(player.left < ball.right && player.right > ball.left &&
           player.top < ball.bottom && player.bottom > ball.top){
               const len = ball.vel.len;
               ball.vel.x = -ball.vel.x;
               ball.vel.y += 300 * (Math.random() - .5);
               ball.vel.len = len * 1.05;
           }
    }
    draw(){
        //draw background
        this._context.fillStyle = '#000';
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

        this.drawRect(this.ball);
        this.players.forEach(p => this.drawRect(p));
        this.drawScore();
    }
    drawRect(rect){
         this._context.fillStyle = '#FFF';
        this._context.fillRect(rect.left, rect.top, 
                               rect.size.x, rect.size.y);
    }
    drawScore(){
        const align = this._canvas.width/3;
        const NUMBER_W = this.NUMBER_PIXEL * 4;
        this.players.forEach((player, index) => {
            const chars = player.score.toString().split('');
            const offset = align * (index + 1) - 
                                   (NUMBER_W * chars.length / 2) + 
                                   this.NUMBER_PIXEL / 2;
            chars.forEach((char, pos) => {
                this._context.drawImage(this.NUMBERS[char|0], offset + pos * NUMBER_W, 20);
            });
        });
    }
    reset(){
        this.ball.pos.x = this._canvas.width / 2;
        this.ball.pos.y = this._canvas.height /2;
        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
    }
    start(){
        if(this.ball.vel.x === 0 && this.ball.vel.y === 0){
            this.ball.vel.x = 300 * (Math.random() > .5 ? 1 : -1);
            this.ball.vel.y = 300 * (Math.random() * 2 -1);
            this.ball.vel.len = 200;
        }

    }
    update(dt){
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;

        //border check
        if(this.ball.left < 0 || this.ball.right > this._canvas.width){
            const playerId = this.ball.vel.x < 0 | 0;
            this.players[playerId].score++;
           this.reset();
        }
        if(this.ball.top < 0 || this.ball.bottom > this._canvas.height){
            this.ball.vel.y = -this.ball.vel.y;
        }
        //AI for the second player
        this.players[1].pos.y = this.ball.pos.y;

        this.players.forEach(player => this.collide(player, this.ball));
        this.draw();
    }

}

const canvas = document.getElementById('gameCanvas');
const pong = new Pong(canvas);


//event handler
canvas.addEventListener('mousemove', event => {
    const scale = event.offsetY / event.target.getBoundingClientRect().height;
    pong.players[0].pos.y = canvas.height * scale;
});

canvas.addEventListener('click', event => {
    pong.start();
});



