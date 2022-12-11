import {Cell, Grid, dead, alive, life, print_grid} from './mod'


function print_grind_neighbours(grid:Grid){
    // just copied print_grind lol
    let grid_str = ""
    grid.get_grid().forEach(row => {
        let out_str = ""
        row.map((cell) => {
            out_str += grid.alive_neighbours(cell, true, true)
            out_str += "  "
        })
        out_str += "\n"
        grid_str += out_str
    });
    console.log(grid_str);
    return(grid_str)
}

class TestGrid extends Grid{
    constructor(size?:number){
        super(size)
    }

    public _alive_neighbours_above_below(cell: Cell){
        return super.alive_neighbours_above_below(cell)
    }

    public _print_grid_with_old_values(format?: boolean): string{
        let r = ""
        for (let i: number = 0; i < this.list_of_cells.length; i++) {
            let r_str = this.list_of_cells[i].old_state ? this.SERIALISE_ALIVE : this.SERIALISE_DEAD
            if (format) {
                r_str += " "
                if ((i + 1) % this.size == 0) r_str += "\n"
            }
            r += r_str
        }
        return r
    }
}



test("Test serialise and deserialise", () => {
    var grid = new Grid(3)
    let load_data = `
            O _ _
            _ O _
            _ _ O
    `
    grid.deserialise(load_data)

    let out_value = grid.serialise(false)
    let expect_value = "O___O___O"
    expect(out_value).toBe(expect_value)
});


describe("_alive_neighbours_above_below", ()=>{

    test("left", () => {
        var grid = new TestGrid(3)
        let load_data = `
                O _ _
                _ _ _
                O _ _
        `
        grid.deserialise(load_data);
        let c = grid.get_cell(1, 1) 
    
        let out_value = grid._alive_neighbours_above_below(c)
        let expect_value = {"above": 1, "below": 1}
        expect(out_value).toMatchObject(expect_value)
    })

    test("middle", () => {
        var grid = new TestGrid(3)
        let load_data = `
                _ O _
                _ _ _
                _ O _
        `
        grid.deserialise(load_data);
        let c = grid.get_cell(1, 1) 
    
        let out_value = grid._alive_neighbours_above_below(c)
        let expect_value = {"above": 1, "below": 1}
        expect(out_value).toMatchObject(expect_value)
    })

    test("right", () => {
        var grid = new TestGrid(3)
        let load_data = `
                _ _ O
                _ _ _
                _ _ O
        `
        grid.deserialise(load_data);
        let c = grid.get_cell(1, 1) 
    
        let out_value = grid._alive_neighbours_above_below(c)
        let expect_value = {"above": 1, "below": 1}
        expect(out_value).toMatchObject(expect_value)
    })

})

describe("test frames", () => {
    test("slider", ()=>{
        var frames = [
            `
            _ _ _ _ _
            _ _ O _ _
            _ O O _	_
            _ O _ O _
            _ _ _ _ _`,
            `
            _ _ _ _ _
            _ O O _ _
            _ O _ O	_
            _ O _ _ _
            _ _ _ _ _`,
            `
            _ _ _ _ _
            _ O O _ _
            O O _ _	_
            _ _ O _ _
            _ _ _ _ _`
        ]

        var grid = new TestGrid(5)
        let load_data = `
            _ _ _ _ _
            _ _ _ _ _
            _ O O O	_
            _ O _ _ _
            _ _ O _ _`
        // ------------------------------
            // load_data = frames[1]
            // frames = []
        // ------------------------------
        grid.deserialise(load_data)
        console.log("Frame 0")
        let frame0 = grid.serialise(true)
        console.log(frame0)
        // ------------------------------
            // grid.grid_update()
            // console.log(grid.serialise(true))
            
        // ------------------------------

        for (let i = 0; i < frames.length; i ++){
            let frame_no = i + 1
            let frame_data = frames[i]
            grid.grid_update()
            let frame = grid.serialise()
            console.log(`Frame${frame_no}: \n${grid.serialise(true)}\n${grid._print_grid_with_old_values(true)}`)
            expect(frame).toBe(frame_data.replace(/[\W]/gm, ""))
        }
        
    });
});