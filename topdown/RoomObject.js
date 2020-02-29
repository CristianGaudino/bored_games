class Room{
	constructor(canvas, room_array, room_row_index, room_col_index, wall_thickness, left_door, right_door, upper_door, lower_door, room_color, wall_quantity){
        console.log("wall quantity is " + wall_quantity);
        this.room_array = room_array;
        this.canvas = canvas;
        this.locked = true;
        this.door_mats = [new Rectangle(wall_thickness, (canvas.height/2)-100, 200, 200, "lime"), new Rectangle(canvas.width - wall_thickness - 200, (canvas.height/2)-100, 200, 200, "lime"), new Rectangle((canvas.width/2) - 100, wall_thickness, 200, 200, "lime"), new Rectangle((canvas.width/2) - 100, (canvas.height - wall_thickness - 200), 200, 200, "lime")];
        this.right_neighbour;
        this.left_neighbour;
        this.upper_neighbour;
        this.lower_neighbour;
        this.room_row_index = room_row_index;
        this.room_col_index = room_col_index;
        this.wall_thickness = wall_thickness;
		this.left_wall = new Border(0, 0, wall_thickness, canvas.height, "black", left_door);
		this.right_wall = new Border(canvas.width - wall_thickness, 0, wall_thickness, canvas.height, "black", right_door);
		this.upper_wall = new Border(wall_thickness, 0, canvas.width - wall_thickness, wall_thickness, "black", upper_door);
		this.lower_wall = new Border(wall_thickness, canvas.height - wall_thickness, canvas.width - wall_thickness, wall_thickness, "black", lower_door);
        this.color = room_color;
        this.static_object_list = [];//wall
        this.projectile_object_list = [];//bullet
        this.entity_list = [];//hero
        this.particle_list = [];
        this.hero_list = [];
        this.wall_list = this.generateWalls(wall_quantity, canvas);
        for (var i = 0; i < this.wall_list.length; i++){
            //console.log("Item in wall list: " + i);
            for (var j = 0; j < this.wall_list[i].wall_blocks.length; j++){
                //console.log("block in wall: " + j);
                this.static_object_list.push(this.wall_list[i].wall_blocks[j]);
            }
        }
        this.addBorderBlocks();


    }
    generateEnemies(hero, enemy_quantity, weapon_value){
        /*for (var i = 0; i < enemy_quantity; i++{
        }*/
        var henry_size = 50;
        var spawn_x;
        var spawn_y;
        var new_henry;
        var attempted_spawns = 0;
        for (var i = 0; i < enemy_quantity; i++){
            
            while (attempted_spawns < 50){
                spawn_x = Math.random() * (this.canvas.width - (this.wall_thickness*2) - henry_size) + this.wall_thickness;
                spawn_y = Math.random() * (this.canvas.height - (this.wall_thickness*2) - henry_size) + this.wall_thickness;
                if (weapon_value == 5){
                    new_henry = new Henry(spawn_x, spawn_y, henry_size, henry_size, "#ff9020", hero, this, 400, weapon_value);
                } else {
                    new_henry = new Henry(spawn_x, spawn_y, henry_size, henry_size, "#9c1000", hero, this, 50, Math.round(Math.random() * weapon_value) + 1);
                }
                if (!this.isOnDoorMat(new_henry) && !this.isOnWall(new_henry)){
                    this.entity_list.push(new_henry);
                    this.room_array.entity_counter += 1;
                    attempted_spawns = -1;
                    break;
                }
                attempted_spawns += 1;
            }
            
            if (attempted_spawns >= 50){
                break;
            }
        }
    }
    
    addBorderBlocks(){
        //add borders to static objects
        this.static_object_list.push(this.left_wall.first_block);
        this.static_object_list.push(this.left_wall.third_block);
        if (this.left_wall.gate_status != "open"){
            this.static_object_list.push(this.left_wall.second_block);
        }

        this.static_object_list.push(this.right_wall.first_block);
        this.static_object_list.push(this.right_wall.third_block);
        if (this.right_wall.gate_status != "open"){
            this.static_object_list.push(this.right_wall.second_block);
        }

        this.static_object_list.push(this.upper_wall.first_block);
        this.static_object_list.push(this.upper_wall.third_block);
        if (this.upper_wall.gate_status != "open"){
            this.static_object_list.push(this.upper_wall.second_block);
        }

        this.static_object_list.push(this.lower_wall.first_block);
        this.static_object_list.push(this.lower_wall.third_block);
        if (this.lower_wall.gate_status != "open"){
            this.static_object_list.push(this.lower_wall.second_block);
        }
    }


	drawSelf(ctx){
        //console.log("left wall null?" + this.left_wall + "\nRight wall null?" + this.right_wall);

        if (this.left_wall != null){
            this.left_wall.drawSelf(ctx);
        }

        if (this.right_wall != null){
            this.right_wall.drawSelf(ctx);
        }

        if (this.upper_wall != null){
            //console.log("drawing upper wall");
            this.upper_wall.drawSelf(ctx);
        }

        if (this.lower_wall != null){
            this.lower_wall.drawSelf(ctx);
        }

        
        //draw the door mats for debugging purposes
        //this.drawDoorMats(ctx);    
        
        
        for (var j = 0; j < this.static_object_list.length; j++){
            this.static_object_list[j].drawSelf(ctx);
            //console.log("drawing static object");
        }
        
        for (var e = 0; e < this.entity_list.length; e++){
            this.entity_list[e].moveAi();
            this.entity_list[e].shoot();
            this.entity_list[e].drawSelf(ctx);
        }
        //console.log("Drawing something...");
        for (var k = 0; k < this.projectile_object_list.length; k++){
            if (this.projectile_object_list[k].stopped){
                this.projectile_object_list.splice(k, 1);
            } else{
                this.projectile_object_list[k].moveBullet();
                this.projectile_object_list[k].drawSelf(ctx);
            }
        }

        for (var l = 0; l < this.particle_list.length; l++){
            if (this.particle_list[l].stopped){
                this.particle_list.splice(l, 1);
            } else{
                this.particle_list[l].moveSelf();
                this.particle_list[l].drawSelf(ctx);
            }
        }
    }

    generateWalls(amount_of_walls, canvas){
	    function not_block_gate(x,y){
	        if(y>=425&&y<=540&&x<=85) {
                return false;//avoid block left gate
            }
            if(y>=425&&y<=540&&x>=1000) {
                return false;// avoid block right gate
            }
            if(y<=80&&x>=480&&x<=795) {
                return false;// avoid block top gate
            }
            if(y>=890&&x>=510&&x<=765) {
                return false;// avoid block low gate
            }
            
            else {
                return true;
            }

        }


        function not_block_entity(x,y, room){
            if(y>=165&&y<=250&&x<=750&&x>=525) {
                return false;//avoid block henry
            }
            if((y>=15&&y<=80&&x<=100) && (room.room_row_index == 2 && room.room_col_index == 2)) {
                return false;//avoid block hero
            }

            else {
                return true;
            }
        }
        function islegal_zone(x, y, arrayx, arrayy) {
            var i=0;
            while(i<arrayx.length)
            {
                if(x>arrayx[i]-175&&x<arrayx[i]+175&&y>arrayy[i]-35&&y<arrayy[i]+35) return false;
                else i++;
            }
            return true;
        }   //if you generate a wall(rectangle), assume that it begins from (x,y), then (x-175,x+175),(y-35,y+35) is illegal zone
        var spawn_space = 175;//150
        var wall_type;
        var walls = [];
        var arrayx=[];
        var arrayy=[];
        var attempted_spawns = 0;
        var wall;
        for (var i = 0; i < amount_of_walls; i++){
            wall_type = Math.round(Math.random() * 1);
            while (attempted_spawns < 50){
                var  new_x = Math.round((Math.random() * (canvas.width - this.wall_thickness - spawn_space)) + this.wall_thickness);
                var  new_y = Math.round((Math.random() * (canvas.height - this.wall_thickness - spawn_space)) + this.wall_thickness);
                wall = new Wall(new_x, new_y, wall_type, "black");
                    if(islegal_zone(new_x ,new_y,arrayx,arrayy)&&not_block_gate(new_x,new_y)&&not_block_entity(new_x,new_y, this) && !this.isOnDoorMat(wall))
                    {
                        walls.push(wall);
                        arrayx.push(new_x);
                        arrayy.push(new_y);
                        //console.log("pushed wall number: " + i);
                        break;
                    } else{
                        //console.log("can't place line at " + new_x + "   " + new_y);
                    }
                attempted_spawns++;
                //console.log("attempted spawn: " + attempted_spawns);
            }
            
            attempted_spawns = 0;
            
        }

        return walls;
    }
    
    isOnDoorMat(object){
            //alert("horizontal wall detected");
            var test_wall = object;
            for (var i = 0; i < this.door_mats.length; i++){
                //console.log("CHECKING DOORMAT. mat x: " + this.door_mats[i].x + " mat y is " + this.door_mats[i].y);
                if ((test_wall.x < this.door_mats[i].x + this.door_mats[i].width && test_wall.x > this.door_mats[i].x) && (test_wall.y < this.door_mats[i].y + this.door_mats[i].height && test_wall.y > this.door_mats[i].y)){
                    //alert("reeee");
                    //console.log("attempted to place x at " + new_x);
                    return true;
                }
                
                else if ((test_wall.x < this.door_mats[i].x + this.door_mats[i].width && test_wall.x > this.door_mats[i].x) && (test_wall.y + test_wall.height < this.door_mats[i].y + this.door_mats[i].height && test_wall.y + test_wall.height > this.door_mats[i].y)){
                    //console.log("attempted to place x at " + new_x);
                    return true;
                }
                
                else if ((test_wall.x + test_wall.width < this.door_mats[i].x + this.door_mats[i].width && test_wall.x + test_wall.width > this.door_mats[i].x) && (test_wall.y < this.door_mats[i].y + this.door_mats[i].height && test_wall.y > this.door_mats[i].y)){
                    //console.log("attempted to place x at " + new_x);
                    return true;
                }
                
                else if ((test_wall.x + test_wall.width < this.door_mats[i].x + this.door_mats[i].width && test_wall.x + test_wall.width > this.door_mats[i].x) && (test_wall.y + test_wall.height < this.door_mats[i].y + this.door_mats[i].height && test_wall.y + test_wall.height > this.door_mats[i].y)){
                    //console.log("attempted to place x at " + new_x);
                    return true;
                }
                    
            }
                    
            //console.log("working...");
            return false;
        }
    
    isOnWall(object){
        for (var i = 0; i < this.wall_list.length; i++){
                //console.log("CHECKING DOORMAT. mat x: " + this.wall_list[i].x + " mat y is " + this.wall_list[i].y);
                if ((object.x < this.wall_list[i].x + this.wall_list[i].width + 20 && object.x > this.wall_list[i].x) && (object.y < this.wall_list[i].y + this.wall_list[i].height + 20 && object.y > this.wall_list[i].y)){
                    //alert("reeee");
                    //console.log("attempted to place x at " + object.x);
                    //this.static_object_list.push(new Rectangle(object.x, object.y, 50, 50, "lime"));
                    return true;
                }
                
                else if ((object.x < this.wall_list[i].x + this.wall_list[i].width + 20 && object.x > this.wall_list[i].x) && (object.y + object.height < this.wall_list[i].y + this.wall_list[i].height + 20 && object.y + object.height > this.wall_list[i].y)){
                    //console.log("attempted to place x at " + object.x);
                    //this.static_object_list.push(new Rectangle(object.x, object.y, 50, 50, "lime"));
                    
                    return true;
                }
                
                else if ((object.x + object.width < this.wall_list[i].x + this.wall_list[i].width + 20 && object.x + object.width > this.wall_list[i].x) && (object.y < this.wall_list[i].y + this.wall_list[i].height + 20 && object.y > this.wall_list[i].y)){
                    //console.log("attempted to place x at " + object.x);
                    //this.static_object_list.push(new Rectangle(object.x, object.y, 50, 50, "lime"));
                    
                    return true;
                }
                
                else if ((object.x + object.width < this.wall_list[i].x + this.wall_list[i].width + 20 && object.x + object.width > this.wall_list[i].x) && (object.y + object.height < this.wall_list[i].y + this.wall_list[i].height + 20 && object.y + object.height > this.wall_list[i].y)){
                    //console.log("attempted to place x at " + object.x);
                    //this.static_object_list.push(new Rectangle(object.x, object.y, 50, 50, "lime"));
                    
                    return true;
                }
                    
            }
                    
            //console.log("working...");
            return false;
    }

    assignNeighbour(direction, room){
        if (direction == "upper"){
            this.upper_neighbour = room;
        } else if (direction == "lower"){
            this.lower_neighbour = room;
        } else if (direction == "left"){
            this.left_neighbour = room;
        } else if (direction == "right"){
            this.right_neighbour = room;
        }
    }

    addEntity(entity){
        this.entity_list.push(entity);
    }

    addProjectile(projectile){
        //console.log("projectile added");
        this.projectile_object_list.push(projectile);
    }

    addParticle(particle){
	    this.particle_list.push(particle);
    }

    printProjectile(){
	    for (var i=0;i<this.projectile_object_list.length;i++){
	        console.log("List item at pos: ", i, "=== ", this.projectile_object_list[i].y_speed);
        }
    }
    
    //When given a border wall, it's gate will be opened
    createGate(border_direction){
        //Which border wall should be opened?
        switch(border_direction){
            case "left":
                var border_wall = this.left_wall;
                this.left_neighbour = this.room_array.array[this.room_row_index][this.room_col_index - 1];
                //console.log("left neighbour: " + this.left_neighbour);
                break;
            case "right":
                var border_wall = this.right_wall;
                this.right_neighbour = this.room_array.array[this.room_row_index][this.room_col_index + 1];
                
                break;
            case "upper":
                var border_wall = this.upper_wall;
                this.upper_neighbour = this.room_array.array[this.room_row_index - 1][this.room_col_index];
                break;
            case "lower":
                this.lower_neighbour = this.room_array.array[this.room_row_index + 1][this.room_col_index];
                var border_wall = this.lower_wall;
                break;
        }
        
        this.lockGates(border_direction);
        
        
        
        //console.log("+++++++++finished iterating");
    }
    
    lockGates(border_direction){
        var border_walls = [this.left_wall, this.right_wall, this.upper_wall, this.lower_wall];
        switch(border_direction){
            case "upper":
                var border_wall = this.upper_wall;
                break;
            
            case "right":
                var border_wall = this.right_wall;
                break;
            
            case "lower":
                var border_wall = this.lower_wall;
                break;
                
            case "left":
                var border_wall = this.left_wall;
                break;
        }
        
        for (var i = 0; i < this.static_object_list.length; i++){
            //console.log("iteration: " + i);
            if (this.static_object_list[i] == border_wall.second_block){
                //console.log("Found second block, its status is " + border_wall.gate_status);
                border_wall.second_block.color = "red";
                border_wall.gate_status = "locked";
                //console.log("second block status is now " + border_wall.gate_status);
            }
            
            else{
                //console.log("haven't found second block yet");
            }
        }
        
    }
    
    openGates(){
        var border_walls = [this.upper_wall, this.right_wall, this.lower_wall, this.left_wall];
        for (var j = 0; j < border_walls.length + 1; j++){
            if (border_walls[j] != null){
                for (var i = 0; i < this.static_object_list.length + 1; i++){
                    //console.log("iteration: " + i);
                    if (this.static_object_list[i] == border_walls[j].second_block && border_walls[j].gate_status === "locked"){
                        //console.log("Found second block, its status is " + border_wall.gate_status);
                        this.static_object_list.splice(i, 1);
                        border_walls[j].second_block.color = this.color;
                        border_walls[j].gate_status = "open";
                        console.log("opened gate");
                        //console.log("second block status is now " + border_wall.gate_status);
                    }
                    
                    else{
                        //console.log("haven't found second block yet");
                    }
                }
            }
        }
    }

}
            

