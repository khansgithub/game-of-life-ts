import { Cell, Grid, dead, alive, life, print_grid } from './mod'


function print_grind_neighbours(grid: Grid) {
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
    return (grid_str)
}

class TestGrid extends Grid {
    constructor(size?: number) {
        super(size)
    }

    public _alive_neighbours_above_below(cell: Cell) {
        return super.alive_neighbours_above_below(cell)
    }

    public _get_relative_cell_state(cell: Cell, relative_cell: Cell, disable=false) {
        return super._get_relative_cell_state(cell: Cell, relative_cell: Cell, disable=false)
    }
}

test("Test serialise and deserialise", () => {
    var grid = new Grid(3)
    let load_data = `
            o _ _
            _ o _
            _ _ o
    `
    grid.deserialise(load_data)

    let out_value = grid.serialise(false)
    let expect_value = "o___o___o"
    expect(out_value).toBe(expect_value)
});

describe("_alive_neighbours_above_below", () => {

    test("left", () => {
        var grid = new TestGrid(3)
        let load_data = `
                o _ _
                _ _ _
                o _ _
        `
        grid.deserialise(load_data);
        let c = grid.get_cell(1, 1)

        let out_value = grid._alive_neighbours_above_below(c)
        let expect_value = { "above": 1, "below": 1 }
        expect(out_value).toMatchObject(expect_value)
    })

    test("middle", () => {
        var grid = new TestGrid(3)
        let load_data = `
                _ o _
                _ _ _
                _ o _
        `
        grid.deserialise(load_data);
        let c = grid.get_cell(1, 1)

        let out_value = grid._alive_neighbours_above_below(c)
        let expect_value = { "above": 1, "below": 1 }
        expect(out_value).toMatchObject(expect_value)
    })

    test("right", () => {
        var grid = new TestGrid(3)
        let load_data = `
                _ _ o
                _ _ _
                _ _ o
        `
        grid.deserialise(load_data);
        let c = grid.get_cell(1, 1)

        let out_value = grid._alive_neighbours_above_below(c)
        let expect_value = { "above": 1, "below": 1 }
        expect(out_value).toMatchObject(expect_value)
    })

})

describe("test frames", () => {
    test("slider", () => {
        var grid = new TestGrid(5)
        let load_data = `
        _ _ _ _ _
        _ _ _ _ _
        _ o o o	_
        _ o _ _ _
        _ _ o _ _`
        grid.deserialise(load_data)

        console.log("Frame 0")
        let frame0 = grid

        grid.grid_update()

        console.log("Frame 1")
        let frame1 = grid.serialise(true)
        console.log(frame1)
    })
})

test("get_relative_cell_state", () => {
    /**
        _ _ _        o o o
        _ _ _   =>   o o o
        _ _ _        o o o
     */

    let grid = new TestGrid(3)
    let load_data = `
        _ _ _
        _ _ _
        _ _ _
    `
    grid.deserialise(load_data);
    let cell: Cell = grid.get_cell(1, 1)

    for (let i = 0; i < grid.list_of_cells.length; i++) {
        let c: Cell = grid.list_of_cells[i]
        let alive_neighbours = grid.alive_neighbours(c, true)

        if (i == 4){
            expect(alive_neighbours).toBe(0)
            return;
        }

        c.old_state = dead
        c.state = alive
    }
});