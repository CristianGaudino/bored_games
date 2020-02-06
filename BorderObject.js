//Forms one of the four borders around the canvas
class Border{
    constructor(x, y, width, height, color, gate_status){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.gate_status = gate_status;
        this.first_block;
        this.second_block;
        this.third_block;
        
        this.generateWallBlockPositions();
    }
    
    //during construction, the border object must discover the positions of the wall chunks
    generateWallBlockPositions(){
        if (this.width < this.height){
            this.first_block = new Rectangle(this.x, this.y, this.width, (this.height/2)-40, this.color);
        }
    }
        
    drawSelf(){}
    
}
