export const dead = false
export const alive = true
export type life = true | false

export class Cell {
    state: life = dead
    old_state: life = this.state
    x = NaN
    y = NaN
    constructor(state = false, x: number = NaN, y: number = NaN) {
        this.state = this.old_state = state
        if (!isNaN(x) && !isNaN(y)) {
            this.x = x;
            this.y = y;
        }
    }

    public set_x(x: number) {
        this.x = x;
    }

    public set_y(y: number) {
        this.y = y;
    }

    stringify(): string {
        return this.state.toString()
    }

    public state_as_int(): number {
        return this.state ? 1 : 0;
    }

    public old_state_as_int(): number {
        return this.old_state ? 1 : 0;
    }

}

export class Grid {
    size: number;
    private grid_arr: any[][];
    private grid_map = new Map();
    public list_of_cells: Cell[] = [];
    SERIALISE_ALIVE: string = "O";
    SERIALISE_DEAD: string = "_";
    test: any

    public constructor(size: number = 0) {
        this.size = size;
        this.grid_arr = new Array(size)
        // https://stackoverflow.com/a/43461022
        for (let y = 0; y < this.size; y++) {
            this.grid_arr[y] = new Array(size)
            for (let x = 0; x < this.size; x++) {
                let cell = new Cell(dead, x, y)
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

    public get_grid(): Cell[][] {
        return this.grid_arr
    }

    public set_grid(g: Cell[][]) {
        this.grid_arr = g;
    }

    public get_cell(x: number, y: number): Cell {
        return this.grid_arr[y][x]
    }

    protected alive_neighbours_above_below(cell: Cell){
        let above_count = 0;
        let below_count = 0;
        let _y = [cell.y - 1, cell.y + 1];
        let _x = [cell.x - 1, cell.x, cell.x + 1]
        _y.forEach(y => {
            // 0 <= y < this.size-1
            if (! (-1 < y && y < this.size) ) {console.log(`y=${y}`); return};
            _x.forEach(x => {
                if (! (-1 < x && x < this.size) ) {console.log(`x=${x}`); return};
                let above_or_below_cell: Cell = this.get_cell(x, y)
                if (above_or_below_cell.y > cell.y)
                    below_count += above_or_below_cell.state_as_int()
                else
                    above_count += above_or_below_cell.old_state_as_int()
            })
            
        });
        return {"above": above_count, "below": below_count}
    }
    public alive_neighbours(cell: Cell, update?: boolean, debug?: boolean): number {
        if (update == false) return -1;

        let above_count = 0;
        let below_count = 0;
        let _y = [cell.y - 1, cell.y + 1];
        _y.forEach((y, is_below) => {
            if (y >= 0 && y < this.size) {
                let _x = [cell.x - 1, cell.x, cell.x + 1]
                _x.forEach(x => {
                    if (x < 0 || x >= this.size) return;
                    let above_or_below_cell: Cell = this.get_cell(x, y)
                    if (above_or_below_cell.y > cell.y)
                        below_count += above_or_below_cell.state_as_int()
                    if (above_or_below_cell.y < cell.y)
                        above_count += above_or_below_cell.old_state_as_int()
                })
            }
        });

        let left = 0;
        if (cell.x > 0) {
            let left_c = this.get_neighbour_left(cell);
            if (left_c != null) left = left_c.old_state_as_int()
        }

        let right = 0;
        if (cell.x < this.size) {
            let right_c = this.get_neighbour_right(cell);
            if (right_c != null) right = right_c.state_as_int()
        }

        if (debug == true) {
            console.log(`above_count: ${above_count}`)
            console.log(`below_count: ${below_count}`)
            console.log(`left: ${left}`)
            console.log(`right: ${right}`)
        }
        return above_count + below_count + left + right
    }

    public dead_neighbours(cell: Cell, update?: boolean): number {
        return (Math.pow(this.size, 2) - this.alive_neighbours(cell, update))
    }

    public propagation_rules(c: Cell, alive_neighbours: number){
        c.old_state = c.state
        if (c.state == alive) {
            if (alive_neighbours == 2 || alive_neighbours == 3) {
                // Any live cell with two or three live neighbours survives.
                c.old_state = c.state
                return;
            } else {
                // All other live cells die in the next generation. Similarly, all other dead cells stay dead.
                c.state = dead;
                return;
            }
        }
        if (c.state == dead) {
            if (alive_neighbours == 3) {
                // Any dead cell with three live neighbours becomes a live cell.
                c.state = alive;
            }
        }
    }

    public grid_update() {
        for (let i = 0; i < this.list_of_cells.length; i++) {
            let c: Cell = this.list_of_cells[i]
            let alive_neighbours = this.alive_neighbours(c, true)
            // console.log(`${c.x},${c.y}`)
            // console.log(alive_neighbours)

            this.propagation_rules(c, alive_neighbours)

        }
    }

    public deserialise(s: string) {
        s = s.replace(/[\W]/gm, "")
        let i = 0;
        this.list_of_cells = []
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let string_cell = s[i]
                let _cell: Cell = new Cell(string_cell === this.SERIALISE_ALIVE ? alive : dead, x, y)
                this.list_of_cells.push(_cell)
                this.grid_arr[y][x] = _cell
                i++
            }
        }
    }

    public serialise(format?: boolean): string {
        let r = ""
        for (let i: number = 0; i < this.list_of_cells.length; i++) {
            let r_str = this.list_of_cells[i].state ? this.SERIALISE_ALIVE : this.SERIALISE_DEAD
            if (format) {
                r_str += " "
                if ((i + 1) % this.size == 0) r_str += "\n"
            }
            r += r_str
        }
        return r
    }

}
export function print_grid(grid: Grid) {
    let grid_str = ""
    grid.get_grid().forEach(row => {
        let out_str = ""
        row.map((cell) => {
            out_str += cell.state ? "●" : "-"
            // out_str += "\n"
            // {
            //     let _print = `${cell.x},${cell.y}`
            //     if (cell.state == alive) _print = `<${_print}>`
            //     out_str += _print
            // }
            out_str += "\t"
        })
        out_str += "\n\n"
        grid_str += out_str
    });
    console.log(grid_str);

    console.log('\n')
}