import { Cell, Grid, dead, alive, life, print_grid } from './mod'

// var grid = new Grid(6)
// let load_data = `
// _ _ _ _ _ _
// _ _ _ _ _ _
// _ _ O O _ _
// _ _ O O _ _
// _ _ _ _ _ _
// `

var grid = new Grid(4)
let load_data = `
_ _ _ _
O O O _
O O O _
_ _ _ _
`

grid.deserialise(load_data)

print_grid(grid)

var n = 2
for (let i in [...Array(n).values()]) {
    grid.grid_update()
    print_grid(grid)
}

print_grid_test(grid)


function print_grid_test(grid: Grid) {
    let grid_str = ""
    grid.get_grid().forEach(row => {
        let out_str = ""
        row.map((cell) => {
            out_str += cell.old_state ? "o" : "_"
            // out_str += cell.state ? "●" : "-"
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