class RoomArray{
    constructor(canvas, room_color){
        this.array = [[],[],[],[],[],[]]
        this.fillArrayWithNulls();
        this.room_counter = 0;
        this.entity_counter = 0;
        this.color = room_color;
        this.defineSpawnRoom(2, 2, canvas);
        this.current_room = this.array[2][2];
        
        //this.definePremadeMapLayout1(canvas);
        //this.associateNeighbours();
        //this.beginGeneratingRooms(canvas, 2, this.current_room);
        //console.log("remaining rooms: " + rr);
        //console.log("roo00000000000000000m counter: " + this.room_counter);
        //this.printArray();
        
    }
    
    addEntity(entity, room_row, room_col){
        //console.log("adding entity to room " + room_row + " " + room_col);
        this.array[room_row][room_col].addEntity(entity);
    }
    
    //Pad out the array with nulls, so that a room doesn't necessarily have to have the first
    //spot in a row
    fillArrayWithNulls(){
        for(var i = 0; i < this.array.length; i++){
            for (var j = 0; j < 6; j++){
                this.array[i][j] = null;
            }
        }
    }
    
    //define the spawn room
    defineSpawnRoom(room_row_index, room_col_index, canvas){
        //console.log("row index in method defineSpawnRoom " + room_row_index);
        this.array[room_row_index][room_col_index] = new Room(canvas, this, room_row_index, room_col_index, 30, "closed", "closed", "closed", "closed", this.color);
        //console.log("Therefore this should be 2: " + this.array[room_row_index][room_col_index].room_row_index);
    }
    
    definePremadeMapLayout1(canvas){
        //console.log("spawn room is " + this.current_room);
        this.array[1][2] = new Room(canvas, this, 1, 2, 30, "closed", "closed", "closed", "closed", this.color);
        this.array[2][1] = new Room(canvas, this, 2, 1, 30, "closed", "closed", "closed", "closed", this.color);
        this.current_room.openGate("left");
        this.array[2][1].openGate("right");
        this.current_room.openGate("upper");
        this.array[1][2].openGate("lower");
    }
    
    generateEnemies(hero){
        //alert("generating enemies for the first time");
        for (var i = 0; i < this.array.length; i++){
            for (var j = 0; j < this.array[i].length; j++){
                //alert.log("new enemy...");
                if (this.array[i][j] != null){
                    this.array[i][j].generateEnemies(hero, 2);
                }
            }
        }
    }
    
    populateRoom(hero, room, room_quantity){
        if (hero == null){
            alert("Undefined hero!");
        } else{
            if (this.room_counter < 2 || (this.room_counter / room_quantity) * 100 < 10){                       
                room.generateEnemies(hero, 1);
            } else if ((this.room_counter / room_quantity) * 100 < 30){
                room.generateEnemies(hero, 2);
            } else if ((this.room_counter / room_quantity) * 100 < 60){
                room.generateEnemies(hero, 3);
            } else if ((this.room_counter == room_quantity)){
                room.generateEnemies(hero, 1);
            } else {
                room.generateEnemies(hero, 4);
            }
        }
        
        
    }
    
    beginGeneratingRooms(canvas, room_quantity, start_room, hero){
        this.populateRoom(hero, this.current_room, room_quantity);
        this.generateRooms(canvas, room_quantity, start_room, hero);
    }
    
    generateRooms(canvas, room_quantity, start_room, hero){
        if (room_quantity <= 0){
            return room_quantity;
        }
        //console.log("genrating rooms..... room_quantity: " + room_quantity);
    
        var rnumber = Math.round(Math.random() * 3);
        var single_generation_success = false;
        //console.log("RNUMBERRRRRRr is " + rnumber);
        //console.log("start room row index is " + start_room.room_row_index);
        //console.log("start room col index is " + start_room.room_col_index);
        //console.log("array width is " + this.array[0].length);
        //console.log("start room upper neighbour is: " + start_room.room_row_index);
        //var rnumber = 3;
        
        if (rnumber === 0 && start_room.room_row_index > 0 && this.array[start_room.room_row_index -1][start_room.room_col_index] == null && this.room_counter < room_quantity){
            this.array[start_room.room_row_index - 1][start_room.room_col_index] = new Room(canvas, this, start_room.room_row_index - 1, start_room.room_col_index, 30, "closed", "closed", "closed", "closed", this.color);
            start_room.createGate("upper");
            //console.log("Lower neighbour is " + this.array[start_room.room_row_index - 1][start_room.room_col_index].lower_neighbour);
            this.array[start_room.room_row_index - 1][start_room.room_col_index].createGate("lower");
            room_quantity -= 1;
            //console.log("ROOM QUANTITY AFTER SUB: " + room_quantity);
            single_generation_success = true;
            //console.log("ROOOOOOOOOOOOOM MADE  " + this.array[start_room.room_row_index - 1][start_room.room_col_index].room_row_index + "   " + this.array[start_room.room_row_index - 1][start_room.room_col_index].room_col_index);
            //this.printArray();
            this.room_counter++;
            this.populateRoom(hero, this.array[start_room.room_row_index - 1][start_room.room_col_index], room_quantity);
            room_quantity = this.generateRooms(canvas, room_quantity, this.array[start_room.room_row_index - 1][start_room.room_col_index], hero);
            //console.log("AFTER RETURN: " + room_quantity);
            
            
            
        } 
        
        if (rnumber === 1 && start_room.room_col_index < this.array[0].length - 1 && this.array[start_room.room_row_index][start_room.room_col_index + 1] == null && this.room_counter < room_quantity){
            this.array[start_room.room_row_index][start_room.room_col_index + 1] = new Room(canvas, this, start_room.room_row_index, start_room.room_col_index + 1, 30, "closed", "closed", "closed", "closed", this.color);
            start_room.createGate("right");
            //console.log("Right neighbour is " + this.array[start_room.room_row_index][start_room.room_col_index].right_neighbour);
            this.array[start_room.room_row_index][start_room.room_col_index + 1].createGate("left");
            room_quantity -= 1;
            single_generation_success = true;
            //console.log("ROOOOOOOOOOOOOM MADE");
            //this.printArray();
            this.room_counter++;
            this.populateRoom(hero, this.array[start_room.room_row_index][start_room.room_col_index + 1], room_quantity);
            room_quantity = this.generateRooms(canvas, room_quantity, this.array[start_room.room_row_index][start_room.room_col_index + 1], hero);
            
            
        }
        
        if (rnumber === 2 && start_room.room_row_index < this.array.length -1 && this.array[start_room.room_row_index + 1][start_room.room_col_index] == null && this.room_counter < room_quantity){
            this.array[start_room.room_row_index + 1][start_room.room_col_index] = new Room(canvas, this, start_room.room_row_index + 1, start_room.room_col_index, 30, "closed", "closed", "closed", "closed", this.color);
            start_room.createGate("lower");
            //console.log("Upper neighbour is " + this.array[start_room.room_row_index + 1][start_room.room_col_index].lower_neighbour);
            this.array[start_room.room_row_index + 1][start_room.room_col_index].createGate("upper");
            room_quantity -= 1;
            single_generation_success = true;
            //console.log("ROOOOOOOOOOOOOM MADE");
            this.room_counter++;
            this.populateRoom(hero, this.array[start_room.room_row_index + 1][start_room.room_col_index], room_quantity);
            room_quantity = this.generateRooms(canvas, room_quantity, this.array[start_room.room_row_index + 1][start_room.room_col_index], hero);
            
            
        }
        
        if (rnumber === 3 && start_room.room_col_index > 0 && this.array[start_room.room_row_index][start_room.room_col_index -1] == null && this.room_counter < room_quantity){
            this.array[start_room.room_row_index][start_room.room_col_index - 1] = new Room(canvas, this, start_room.room_row_index, start_room.room_col_index - 1, 30, "closed", "closed", "closed", "closed", this.color);
            start_room.createGate("left");
            //console.log("Left neighbour is " + this.array[start_room.room_row_index][start_room.room_col_index].right_neighbour);
            this.array[start_room.room_row_index][start_room.room_col_index - 1].createGate("right");
            room_quantity -= 1;
            single_generation_success = true;
            this.room_counter++;
            this.populateRoom(hero, this.array[start_room.room_row_index][start_room.room_col_index - 1], room_quantity);
            room_quantity = this.generateRooms(canvas, room_quantity, this.array[start_room.room_row_index][start_room.room_col_index - 1], hero);
            
            
        }
        
        if (!single_generation_success){
            //console.log("GENERATION FAILURE");
        }
        //console.log("In row: " + start_room.room_row_index + "  and col: " + start_room.room_row_index + "\nRoom quantity is: " + room_quantity + "\n@@@@@@");
        if (this.room_counter < room_quantity && this.checkSurroundingRooms(start_room.room_row_index, start_room.room_col_index)){
            //room_quantity -= 1;
            //console.log("SKIPPING");
            
            room_quantity = this.generateRooms(canvas, room_quantity, start_room, hero);
        }
            
            
           return room_quantity;
    }
    
    
    //Outdated function. Now done using openGate
    associateNeighbours(){
        for (var i = 0; i < this.array.length; i++){
            for (var j; j < this.array[i].length; j++){
                if (this.array[i][j] != null){
                    //If there is a room on the left, set it as this room's left neighbour
                    if (j > 0 && this.array[i][j-1] != null){
                        this.array[i][j].left_neighbour = this.array[i][j-1];
                    } else if (j < this.array[i].length && this.array[i][j+1] != null){
                        this.array[i][j].right_neighbour = this.array[i][j+1];
                    }
                }
            }
        }
    }
    
    //Check around a room to see if has the space needed to branch out
    checkSurroundingRooms(row_index, col_index){
        if (row_index > 0){
            if (this.array[row_index - 1][col_index] == null){
                return true;
            }
        }
        
        if (row_index < this.array.length - 1){
            if (this.array[row_index + 1][col_index] == null){
                return true;
            }
        }
        
        if (col_index > 0){
            if (this.array[row_index][col_index - 1] == null){
                return true;
            }
        }
        
        if (col_index < this.array[row_index].length - 1){
            if (this.array[row_index][col_index + 1] == null){
                return true;
            }
        }
        
        return false;
    }
    
        
    //Print out the 2d array
    printArray(){
        console.log("printing array...");
        for (var i = 0; i < this.array.length; i++){
            console.log("Row: " + i);
            for (var j = 0; j < this.array.length; j++){
                console.log("At col " + j + ", this is a " + this.array[i][j]);
                if (this.array[i][j] != null){
                    console.log("This room says it's at row " + this.array[i][j].room_row_index + " and column " + this.array[i][j].room_col_index);
                }
            }
        }
    }
    
}
