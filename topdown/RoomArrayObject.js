class RoomArray{
    constructor(canvas, room_color){
        this.array = [[],[],[],[],[],[]]
        this.fillArrayWithNulls();
        this.color = room_color;
        this.defineSpawnRoom(2, 2, canvas);
        this.current_room = this.array[2][2];
        //this.definePremadeMapLayout1(canvas);
        //this.associateNeighbours();
        this.generateRooms(canvas, 10, this.current_room);
        this.printArray();
        
    }
    
    addEntity(entity, room_row, room_col){
        console.log("adding entity to room " + room_row + " " + room_col);
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
        console.log("row index in method defineSpawnRoom " + room_row_index);
        this.array[room_row_index][room_col_index] = new Room(canvas, this, room_row_index, room_col_index, 30, "closed", "closed", "closed", "closed", this.color);
        console.log("Therefore this should be 2: " + this.array[room_row_index][room_col_index].room_row_index);
    }
    
    definePremadeMapLayout1(canvas){
        console.log("spawn room is " + this.current_room);
        this.array[1][2] = new Room(canvas, this, 1, 2, 30, "closed", "closed", "closed", "closed", this.color);
        this.array[2][1] = new Room(canvas, this, 2, 1, 30, "closed", "closed", "closed", "closed", this.color);
        this.current_room.openGate("left");
        this.array[2][1].openGate("right");
        this.current_room.openGate("upper");
        this.array[1][2].openGate("lower");
    }
    
    generateRooms(canvas, room_quantity, start_room){
        console.log("genrating rooms..... room_quantity: " + room_quantity);
        while (room_quantity > 0){
            var rnumber = Math.round(Math.random() * 3);
            //console.log("RNUMBERRRRRRr is " + rnumber);
            console.log("start room row index is " + start_room.room_row_index);
            console.log("start room col index is " + start_room.room_col_index);
            console.log("array width is " + this.array[0].length);
            console.log("start room upper neighbour is: " + start_room.room_row_index);
            //var rnumber = 3;
            if (rnumber === 0 && start_room.room_row_index > 0 && this.array[start_room.room_row_index -1][start_room.room_col_index] == null){
                this.array[start_room.room_row_index - 1][start_room.room_col_index] = new Room(canvas, this, start_room.room_row_index - 1, start_room.room_col_index, 30, "closed", "closed", "closed", "closed", this.color);
                start_room.openGate("upper");
                console.log("Lower neighbour is " + this.array[start_room.room_row_index - 1][start_room.room_col_index].lower_neighbour);
                this.array[start_room.room_row_index - 1][start_room.room_col_index].openGate("lower");
                room_quantity -= 1;
                this.generateRooms(canvas, room_quantity, this.array[start_room.room_row_index - 1][start_room.room_col_index]);
            } 
            
            else if (rnumber === 1 && start_room.room_col_index < this.array[0].length && this.array[start_room.room_row_index][start_room.room_col_index + 1] == null){
                this.array[start_room.room_row_index][start_room.room_col_index + 1] = new Room(canvas, this, start_room.room_row_index, start_room.room_col_index + 1, 30, "closed", "closed", "closed", "closed", this.color);
                start_room.openGate("right");
                console.log("Right neighbour is " + this.array[start_room.room_row_index][start_room.room_col_index].right_neighbour);
                this.array[start_room.room_row_index][start_room.room_col_index + 1].openGate("left");
                room_quantity -= 1;
                this.generateRooms(canvas, room_quantity, this.array[start_room.room_row_index][start_room.room_col_index + 1]);
            }
            
            /*else if (rnumber === 2 && start_room.room_row_index < this.array.length && this.array[start_room.room_row_index + 1][start_room.room_col_index] == null){
                this.array[start_room.room_row_index + 1][start_room.room_col_index] = new Room(canvas, this, start_room.room_row_index + 1, start_room.room_col_index, 30, "closed", "closed", "closed", "closed", this.color);
                start_room.openGate("lower");
                console.log("Upper neighbour is " + this.array[start_room.room_row_index + 1][start_room.room_col_index].lower_neighbour);
                this.array[start_room.room_row_index + 1][start_room.room_col_index].openGate("upper");
                room_quantity -= 1;
                this.generateRooms(canvas, room_quantity, this.array[start_room.room_row_index + 1][start_room.room_col_index]);
            }*/
            
            else if ((rnumber === 3 || rnumber === 2) && start_room.room_col_index > 0 && this.array[start_room.room_row_index][start_room.room_col_index -1] == null){
                this.array[start_room.room_row_index][start_room.room_col_index - 1] = new Room(canvas, this, start_room.room_row_index, start_room.room_col_index - 1, 30, "closed", "closed", "closed", "closed", this.color);
                start_room.openGate("left");
                console.log("Left neighbour is " + this.array[start_room.room_row_index][start_room.room_col_index].right_neighbour);
                this.array[start_room.room_row_index][start_room.room_col_index - 1].openGate("right");
                room_quantity -= 1;
                this.generateRooms(canvas, room_quantity, this.array[start_room.room_row_index][start_room.room_col_index - 1]);
            }
            
            return room_quantity;
                
            
            
        }
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
