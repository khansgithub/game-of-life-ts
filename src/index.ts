// import {Grid, Cell, dead, alive, print_grid} from './mod'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function setup_ui(grid: Grid) {
    let width = 10
    let grid_container = document.getElementById("grid-container");
    grid_container.style.gridTemplateColumns = `repeat(${grid.size}, ${width}px)`;

    for (let c of grid.list_of_cells) {
        let grid_item = document.createElement("div")
        grid_item.style.width = `${width}px`
        grid_item.style.height = `${width}px`
        grid_item.classList.add("grid-item")
        grid_item.id = `${c.x},${c.y}`
        if(c.state.bool) grid_item.classList.add("alive")
        grid_container.appendChild(grid_item)
    }
}

(async () => {

    console.log("start")
    var load_data = `
    --O---O---
    --O---O---
    O----O----
    -O--O--O--
    ---O-O----
    O----O----
    --O---O---
    --O---O--- 
`

    var len = load_data.split('\n')[1].replace(/\s/g, "").length
    const grid = new Grid(len)
    grid.deserialise(load_data, "O")
    setup_ui(grid)
    print_grid(grid)
    var frame = 0;
    var updates: any[];
    while (true) {
        frame++;
        // console.clear()
        // console.log(`Frame ${frame}`)
        // print_grid(grid)
        // if(frame == 3){
        //     debugger;
        // }
        updates = await grid.grid_update()
        // console.log(updates.map(c => { return `${c.x}, ${c.y}` }))
        updates.map( c=> {
            document.getElementById(`${c.x},${c.y}`).classList.toggle("alive")
        })
        await sleep(1000);
        if (updates.length == 0) break
    }
})();