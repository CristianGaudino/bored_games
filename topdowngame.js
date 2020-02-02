

document.addEventListener("DOMContentLoaded", function(event){
    init();
});

function init(){
    //Instantiate the canvas and its context.
    var canvas = document.getElementById('game_canvas');
    var ctx = canvas.getContext('2d');
    var vertical_speed = 0;
    var horizontal_speed = 0;
    var recorded_event;
    var moving_down;
    var moving_right;
    var moving_left;
    var moving_up;
    
    document.addEventListener('keydown', function(event){
        if(event.key == "w"){
            vertical_speed = 5;
            moving_up = true;
        }
    });
    
    document.addEventListener('keydown', function(event){
        
        if(event.key == "d"){
            horizontal_speed = -5;
            moving_right = true;
        }
    });
    
    document.addEventListener('keydown', function(event){
        if(event.key == "a"){
            horizontal_speed = 5;
            moving_left = true;
        }
    });
    
    document.addEventListener('keydown', function(event){
        
        if(event.key == "s"){
            vertical_speed = -5;
            moving_down = true;
        }
    });
        
    vertical_line_list = [];
    vertical_line_list.push(new VerticalGridLine(ctx, 10, -100));
    
    document.addEventListener('keyup', function(event){
        if(event.key == "w"){
            moving_up = false;
        }
        
        if(event.key == "s"){
            moving_down = false;
        }
        
        if(event.key == "d"){
            moving_right = false;
        }
        
        if(event.key == "a"){
            moving_left = false;
        }
       
        
                
    });
    var falling_cube = {
        x: 20,
        y: 20
    }
    
    var player = {
        x: 500,
        y: 500
    }
    //start the animations
    setInterval(function() {
        if(moving_down == false && moving_up == false){
            vertical_speed = 0;
        }
        
        if(moving_left == false && moving_right == false){
            horizontal_speed = 0;
        }
        draw(canvas, ctx, falling_cube, player, vertical_speed, horizontal_speed, vertical_line_list);
        
        
    }, 10);
    
}

function draw(canvas, ctx, falling_cube, player, vertical_speed, horizontal_speed, vertical_line_list){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "beige";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "purple";
    ctx.fillRect(falling_cube.x, falling_cube.y, 50, 50);
    falling_cube.y =falling_cube.y + vertical_speed;
    falling_cube.x = falling_cube.x + horizontal_speed;
    
    
    ctx.fillRect(player.x, player.y, 50, 50);
    for (var i=0; i < vertical_line_list.length; i++){
        console.log("drawing one");
        vertical_line_list[i].drawSelf("black");
    }
}








class VerticalGridLine{
    constructor(ctx, x, y){
        this.x;
        this.y;
        this.ctx = ctx;
        this.height = 3000;
        this.width = 5;
    }
    
    drawSelf(style){
        console.log("drawing myself");
        this.ctx.fillStyle = style;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
        
