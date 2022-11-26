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
    get_neighbour_left(cell: Cell): Cell | null {
        if (cell.x <= 0) return null
        return this.get_cell(cell.x - 1, cell.y)
    }

    get_neighbour_right(cell: Cell) {
        if (cell.x >= this.size) return null
        return this.get_cell(cell.x + 1, cell.y)
    }

    get_neighbour_above(cell: Cell) {
        if (cell.y < 0) return null
        return this.get_cell(cell.x, cell.y - 1)
    }

    get_neighbour_below(cell: Cell) {
        if (cell.y >= this.size) return null
        return this.get_cell(cell.x, cell.y + 1)
    }

    public get_grid():Cell[][]{
        return this.grid_arr
    }

    public get_cell(x:number, y:number): Cell{
        return this.grid_arr[y][x]
    }

    public alive_neighbours(cell: Cell, update?: boolean, debug?: boolean): number{
        if (update == false) return -1;
        let above_count = 0;
        let below_count = 0;

        let _y = [cell.y - 1, cell.y + 1];
        _y.forEach( (y, is_below) => {
            if (y >= 0 && y < this.size){
                let _x = [cell.x - 1, cell.x, cell.x + 1]
                _x.forEach( x => {
                    if (x < 0 || x >= this.size) return;
                    let above_or_below_cell: Cell = this.get_cell(x, y)
                    if (is_below == 0) above_count += above_or_below_cell.old_state_as_int()
                    if (is_below == 1) below_count += above_or_below_cell.state_as_int()
                })
            }
        });
        
        let left = 0;
        if (cell.x > 0){
            let left_c = this.get_neighbour_left(cell);
            if (left_c != null) left = left_c.old_state_as_int()
        }

        let right = 0;
        if (cell.x < this.size){
            let right_c = this.get_neighbour_right(cell);
            if (right_c != null) right = right_c.state_as_int()
        }

        if (debug == true){
            console.log(`above_count: ${above_count}`)
            console.log(`below_count: ${below_count}`)
            console.log(`left: ${left}`)
            console.log(`right: ${right}`)
        }
        return above_count + below_count + left + right
    }

    public dead_neighbours(cell: Cell, update?: boolean): number{
        return (Math.pow(this.size, 2) - this.alive_neighbours(cell, update))
    }

    public grid_update(){
        for(let i = 0; i < this.list_of_cells.length; i++){
            let c: Cell = this.list_of_cells[i]
            let alive_neighbours = this.alive_neighbours(c, true)
            
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
            out_str += v.state ? "●" : ""
            out_str += "\t"
        })
        out_str += "\n"
        console.log(out_str)
    });
    console.log('\n')
}

(async () => {
    const grid = new Grid(10)
    let c:Cell = grid.get_cell(Math.floor(grid.size/2), Math.floor(grid.size/2))
    c.state = alive;

    [
        grid.get_neighbour_right(c),
        grid.get_neighbour_left(c),
        grid.get_neighbour_below((grid.get_neighbour_left(c) as Cell)),
        grid.get_neighbour_below((grid.get_neighbour_below(c) as Cell)),

    ].forEach(( _c : Cell | null) => {
        if (_c != null) _c.state = alive
    })
    print_grid(grid)
    while (true){
        console.clear()
        print_grid(grid)
        grid.grid_update()
        await sleep(1000);
    }
})();
