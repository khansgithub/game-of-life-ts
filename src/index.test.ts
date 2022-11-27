import {Cell, Grid, dead, alive, life, print_grid} from './mod'

// {
//     const grid = new Grid(5)
//     let c:Cell = grid.get_cell(Math.floor(grid.size/2), Math.floor(grid.size/2))
//     c.state = alive;
//     [
//         grid.get_neighbour_right(c),
//         grid.get_neighbour_left(c),
//         grid.get_neighbour_below((grid.get_neighbour_left(c) as Cell)),
//         grid.get_neighbour_below((grid.get_neighbour_below(c) as Cell)),

//     ].forEach(( _c : Cell | null) => {if (_c != null) _c.state = alive})
//     grid.grid_update();
//     grid.grid_update();
//     grid.grid_update();
// }

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

var grid = new Grid(5)
/*
    ●  ●  ●  |  -  ●  - 
    ●  -  -  |  ●  ●  -
    -  ●  -  |  ●  -  ●
==================
    3  3  2
    3  4  4
    3  2  2
*/ 
 
let frame_1 = [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [2, 1]
]
let offset = 2
frame_1.forEach(pair => {
    grid.get_cell(pair[1]+offset, pair[0]+offset).state = alive
})
grid._update_list_of_cells()
// let _regex = /\W/g
// let result = print_grind_neighbours(grid)
// let exp = `
//     3  3  2
//     3  4  4
//     3  2  2
// `
print_grid(grid);
console.log("---");

grid.grid_update();print_grid(grid);console.log("---");
grid.grid_update();print_grid(grid);console.log("---");
console.log(grid);

// grid.grid_update();print_grid(grid);console.log("---");

