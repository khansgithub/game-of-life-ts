import { Cell, Grid, dead, alive, life, print_grid } from './mod'

var grid = new Grid(5)

grid.list_of_cells = [
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 0; c.y = 0; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 1; c.y = 0; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 2; c.y = 0; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 3; c.y = 0; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 4; c.y = 0; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 0; c.y = 1; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 1; c.y = 1; return c })(),
    (() => { let c = new Cell(); c.state = true; c.old_state = false; c.x = 2; c.y = 1; return c })(),
    (() => { let c = new Cell(); c.state = true; c.old_state = true; c.x = 3; c.y = 1; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 4; c.y = 1; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 0; c.y = 2; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 1; c.y = 2; return c })(),
    (() => { let c = new Cell(); c.state = true; c.old_state = true; c.x = 2; c.y = 2; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = true; c.x = 3; c.y = 2; return c })(),
    (() => { let c = new Cell(); c.state = true; c.old_state = false; c.x = 4; c.y = 2; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 0; c.y = 3; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 1; c.y = 3; return c })(),
    (() => { let c = new Cell(); c.state = true; c.old_state = true; c.x = 2; c.y = 3; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 3; c.y = 3; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = true; c.x = 4; c.y = 3; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 0; c.y = 4; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 1; c.y = 4; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 2; c.y = 4; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = true; c.x = 3; c.y = 4; return c })(),
    (() => { let c = new Cell(); c.state = false; c.old_state = false; c.x = 4; c.y = 4; return c })()
]

let _grid = grid.get_grid()
let i = 0;
_grid.forEach(r => {
    r.forEach(c => {
        c.state = grid.list_of_cells[i].state;
        c.old_state = grid.list_of_cells[i].old_state;
        i++;
    })
})

/*
_ _ _ _ _  |  _ _ _ _ _
_ _ _ _ _  |  _ _ _ _ _
_ _ # # _  |  _ _ # # _
_ _ # _ #  |  _ # # _ _
_ _ # _ _  |  _ _ _ # _
*/
grid.set_grid(_grid)
grid.grid_update()
print_grid(grid)