const dead = false
const alive = true
type life = true | false

class Cell {
    state: life = dead
    old_state:life = this.state
    x = NaN
    y = NaN
    constructor(state = false, x:number = NaN, y:number = NaN){
        this.state = state
        if (!isNaN(x) && !isNaN(y)){
            this.x = x;
            this.y = y;
        }
    }

    public set_x(x:number){
        this.x = x;
    }

    public set_y(y:number){
        this.y = y;
    }

    stringify(): string{
        return this.state.toString()
    }

    public state_as_int() : number{
        return this.state ? 1 : 0;
    }
    
    public old_state_as_int() : number{
        return this.old_state ? 1 : 0;
    }

}

class Grid {
    size: number;
    private grid_arr: any[][];
    private grid_map = new Map()
    private list_of_cells:Cell[] = []
    constructor(size: number = 0){
        this.size = size;
        this.grid_arr = new Array(size)
        // https://stackoverflow.com/a/43461022
        for (let y = 0; y < this.size; y++){
            this.grid_arr[y] = new Array(size)
            for (let x = 0; x < this.size; x++){
                let cell = new Cell()
                cell.set_x(x)
                cell.set_y(y)
                this.grid_arr[y][x] = cell 
                this.list_of_cells.push(cell)
            }
        }
    }

    public _update_list_of_cells(){
        this.list_of_cells = [];
        for (let y = 0; y < this.size; y++){
            for (let x = 0; x < this.size; x++){
                let cell: Cell = this.grid_arr[y][x]
                this.list_of_cells.push(cell)
            }
        }        
    }
    get_neighbour_left(cell: Cell): Cell {
        return this.get_cell(Math.max((cell.x - 1), 0), cell.y)
    }

    get_neighbour_right(cell: Cell) {
        return this.get_cell(Math.min((cell.x + 1), this.size-1), cell.y)
    }

    get_neighbour_above(cell: Cell) {
        return this.get_cell(cell.x, Math.max((cell.y - 1), 0))
    }

    get_neighbour_below(cell: Cell) {
        return this.get_cell(cell.x, Math.min((cell.y + 1), this.size-1))
    }

    public get_grid():Cell[][]{
        return this.grid_arr
    }

    public get_cell(x:number, y:number): Cell{
        return this.grid_arr[y][x]
    }

    public alive_neighbours(cell: Cell, update?: boolean): number{
        /*
        * When `update` is true, this function is called sequentially across all the grid.
        * The cell can be updated and evaluated at the same time by using both the `old_state` and `state` field. 
        */
        // let count = 0;
        // count += (
        //     this.get_neighbour_above(cell).old_state_as_int() +
        //     this.get_neighbour_left(cell).old_state_as_int() +
        //     this.get_neighbour_right(cell).state_as_int() +
        //     this.get_neighbour_below(cell).state_as_int()
        // );
        // let that = this;
        // [   
        //     this.get_neighbour_above.bind(this),
        //     this.get_neighbour_below.bind(this),
        //     this.get_neighbour_left.bind(this),
        //     this.get_neighbour_right.bind(this)
        // ].map((f) =>{
        //     let neighbour_cell = f(cell)
        //     if (neighbour_cell.state == alive) count += 1
        // })
        
        // return count

        let r = 0;;
        if (typeof(update) !== "undefined"){
            update = false;
        }

        if (update){
            r += (
                this.get_neighbour_above(cell).old_state_as_int() +
                this.get_neighbour_left(cell).old_state_as_int()
            );           
        } else {
            r += (
                this.get_neighbour_above(cell).state_as_int() +
                this.get_neighbour_left(cell).state_as_int()
            );             
        }

        r += (  this.get_neighbour_right(cell).state_as_int() +
                this.get_neighbour_below(cell).state_as_int()   );
    
        return r;
    }

    public dead_neighbours(cell: Cell, update?: boolean): number{
        return (Math.pow(this.size, 2) - this.alive_neighbours(cell, update))
    }

    public grid_update(){
        for(let i = 0; i < this.list_of_cells.length; i++){
            let c: Cell = this.list_of_cells[i]
            let alive_neighbours = this.alive_neighbours(c, true)
            if (i == 11){
                c.state = alive;
                continue;
                console.log(c)
                console.log(alive_neighbours)
            }
            if (c.state == alive){
                if (alive_neighbours == 2 || alive_neighbours == 3) {
                // Any live cell with two or three live neighbours survives.
                    c.old_state = c.state
                    continue;
                } else {
                    // All other live cells die in the next generation. Similarly, all other dead cells stay dead.
                    c.old_state = c.state
                    c.state = dead;
                    continue;
                }
            }
            if (c.state == dead){
                if (alive_neighbours == 3){
                    // Any dead cell with three live neighbours becomes a live cell.
                    c.old_state = c.state
                    c.state = alive;
                }
            }
        }
    }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
function print_grid(grid: Grid){
    grid.get_grid().forEach(row => {
        let out_str = ""
        row.map((v) => {
            out_str += v.state ? "●" : "○"
            out_str += "\t"
        })
        out_str += "\n"
        console.log(out_str)
    });
}

(async () => {
    const grid = new Grid(5)
    let c:Cell = grid.get_cell(Math.floor(grid.size/2), Math.floor(grid.size/2))
    c.state = alive
    grid.get_neighbour_above(c).state = alive
    grid.get_neighbour_below(c).state = alive
    grid._update_list_of_cells()
    // console.log(grid)
    grid.grid_update()
    print_grid(grid)
    
    // while (true){
    //     console.clear()
    //     print_grid(grid)

    //     grid.grid_update()
    //     await sleep(2000);
    // }
})();
