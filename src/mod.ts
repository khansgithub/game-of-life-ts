class Life {
    readonly bool: boolean

    constructor(state: boolean) {
        this.bool = state
    }

    public toString(): string {
        return this.bool ? "alive" : "dead"
    }
}

const dead = new Life(false)
const alive = new Life(true)

class Cell {
    state: Life = dead
    new_state: Life = dead
    x = NaN
    y = NaN
    grid: Grid

    constructor(state: Life, x: number = NaN, y: number = NaN, g: Grid) {
        this.grid = g
        this.state = state
        if (!isNaN(x) && !isNaN(y)) {
            this.x = x;
            this.y = y;
        }
    }

    public apply_rule(): Promise<void> {
        /**
         * Apply the rule to the current cell, and store the next state in new_state
         */
        return new Promise<void>((res, rej) => {
            var alive_neighbours = this.grid.alive_neighbours(this)
            this.new_state = this.rule(alive_neighbours)
            res()
        })
    }

    public update_to_new_state(): Promise<boolean> {
        /**
         * Move the cell to the next stage in life by shfiting to new_state.
         * Returns True if the new_state is different to current_state
         */
        return new Promise<boolean>((res, rej) => {
            var r:boolean = this.state != this.new_state
            this.state = this.new_state
            res(r)
        })
    }

    protected rule(alive_neighbours: number): Life {
        var c = this
        var new_state: Life = this.state
        switch(c.state){
            case alive:
                if (alive_neighbours == 2 || alive_neighbours == 3) {
                    // Any live cell with two or three live neighbours survives.
                    new_state = this.state;
                } else {
                    // All other live cells die in the next generation. Similarly, all other dead cells stay dead.
                    new_state = dead;
                }
                break;
            case dead:
                if (alive_neighbours == 3) {
                    // Any dead cell with three live neighbours becomes a live cell.
                    new_state = alive
                }
                break;
            default:
                break;
        }
        return new_state
    }

    public set_x(x: number) {
        this.x = x;
    }

    public set_y(y: number) {
        this.y = y;
    }

    public toString(): string {
        return this.state.toString()
    }

    public state_as_int(): number {
        return this.state.bool ? 1 : 0;
    }
}

class Grid {
    size: number;
    private grid_arr: any[][];
    public list_of_cells: Cell[] = [];
    SERIALISE_ALIVE: string = ".";
    SERIALISE_DEAD: string = " ";

    public constructor(size: number = 0) {
        this.size = size;
        this.grid_arr = new Array(size)
        // https://stackoverflow.com/a/43461022
        for (let y = 0; y < this.size; y++) {
            this.grid_arr[y] = new Array(size)
            for (let x = 0; x < this.size; x++) {
                let cell = new Cell(dead, x, y, this)
                this.grid_arr[y][x] = cell
                this.list_of_cells.push(cell)
            }
        }
    }

    public _update_list_of_cells() {
        this.list_of_cells = [];
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let cell: Cell = this.grid_arr[y][x]
                this.list_of_cells.push(cell)
            }
        }
    }

    public get_grid(): Cell[][] {
        return this.grid_arr
    }

    public set_grid(g: Cell[][]) {
        this.grid_arr = g;
    }

    public get_cell(x: number, y: number): Cell {
        return this.grid_arr[y][x]
    }

    public alive_neighbours(cell: Cell): number {
        var count = 0
        var vectors = [
            // top left, top, top right
            [-1, -1],
            [-1, 0],
            [-1, +1],

            // left, right
            [0, -1],
            [0, +1],

            // bottom left, bottom, bottom right
            [+1, -1],
            [+1, 0],
            [+1, +1],
        ]

        for (let vec of vectors) {
            var relative_cell_x = cell.x + vec[1]
            var relative_cell_y = cell.y + vec[0]
            if ([relative_cell_x, relative_cell_y].some(v => v < 0 || v >= this.size))
                continue;
            var relative_cell = cell.grid.get_cell(relative_cell_x, relative_cell_y)
            if (relative_cell.state.bool) count++
        }
        return count
    }

    public dead_neighbours(cell: Cell, update?: boolean): number {
        return (Math.pow(this.size, 2) - this.alive_neighbours(cell))
    }

    public async grid_update(): Promise<Cell[]> {
        if(this.size == 0) throw Error("Grid has not be initialised; size is 0")

        let lc = this.list_of_cells
        let changed_cells:Cell[] = []
        let apply_map = (c:Cell) => c.apply_rule()

        await Promise.all<void>(lc.map(apply_map))
        for (let c of lc) {
            let change = await c.update_to_new_state()
            if (change) changed_cells.push(c)
        }
        return changed_cells
    }

    public deserialise(s: string, alive_char_input?: string) {
        var alive_char = this.SERIALISE_ALIVE
        if(alive_char_input) alive_char = alive_char_input
        s = s.replace(/\s/gm, "")
        let i = 0;
        this.list_of_cells = []
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let string_cell = s[i]
                let _cell: Cell = new Cell(string_cell === alive_char ? alive : dead, x, y, this)
                this.list_of_cells.push(_cell)
                this.grid_arr[y][x] = _cell
                i++
            }
        }
    }

    public serialise(format?: boolean): string {
        let r = ""
        for (let i: number = 0; i < this.list_of_cells.length; i++) {
            let r_str = this.list_of_cells[i].state.bool ? this.SERIALISE_ALIVE : this.SERIALISE_DEAD
            if (format) {
                r_str += " "
                if ((i + 1) % this.size == 0) r_str += "\n"
            }
            r += r_str
        }
        return r
    }

}

function print_grid(grid: Grid) {
    let grid_str = ""
    grid.get_grid().forEach(row => {
        let out_str = ""
        row.map((cell) => {
            out_str += cell.state.bool ? "●" : ""
            out_str += "\t"
        })
        out_str += "\n\n"
        grid_str += out_str
    });

    console.log(grid_str);
    console.log('\n')
}

// export {dead, alive, Cell, Grid, print_grid}