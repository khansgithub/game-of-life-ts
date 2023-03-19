import { Cell, Grid, dead, alive, life, print_grid } from './mod'

var grid = new Grid(6)
let load_data = `
_ _ _ _ _ _
_ _ _ _ _ _
_ _ O O _ _
_ _ O O _ _
_ _ _ _ _ _
`
grid.deserialise(load_data)


// function propagation_rules_test(c: Cell, alive_neighbours: number){
//     if (c.state == alive){
//         c.old_state = c.state
//         c.state = dead
//         return
//     }

//     var right_c: Cell|null = grid.get_neighbour_right(c)
//     if (c.state == dead && right_c != null && right_c.state == alive){
//         c.old_state = c.state
//         c.state = alive
//         return
//     }
// }
// grid.propagation_rules = propagation_rules_test

print_grid(grid)

grid.grid_update()
print_grid(grid)

grid.grid_update()
print_grid(grid)