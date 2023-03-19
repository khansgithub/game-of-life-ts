import {Grid, Cell, dead, alive, print_grid} from './mod'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));


(async () => {
    const grid = new Grid(7)
    let load_data = `
    _ _ _ _ _ _ _
    _ _ _ _ _ _ _
    _ _ O _ _ _ _
    O _ O _ _ _ _
    _ O O _ _ _ _
    _ _ _ _ _ _ _
    _ _ _ _ _ _ _
    `
    grid.deserialise(load_data)
    // let c:Cell = grid.get_cell(Math.floor(grid.size/2), Math.floor(grid.size/2))
    // c.state = alive;
    // [
    //     grid.get_neighbour_right(c),
    //     grid.get_neighbour_left(c),
    //     grid.get_neighbour_below((grid.get_neighbour_left(c) as Cell)),
    //     grid.get_neighbour_below((grid.get_neighbour_below(c) as Cell)),

    // ].forEach(( _c : Cell | null) => {if (_c != null) _c.state = alive})

    // print_grid(grid)


    let frame = 0;
    while (true){
        frame++;
        console.clear()
        print_grid(grid)
        // if(frame == 3){
        //     debugger;
        // }
        grid.grid_update()
        await sleep(1000);
    }
})();