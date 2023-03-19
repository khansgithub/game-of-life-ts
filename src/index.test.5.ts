import { Cell, Grid, dead, alive, life, print_grid } from './mod'

// var grid = new Grid(6)
// let load_data = `
// _ _ _ _ _ _
// _ _ _ _ _ _
// _ _ O O _ _
// _ _ O O _ _
// _ _ _ _ _ _
// `

var grid = new Grid(6)
let load_data = `
_ _ _ _ _ _
_ _ O _ _ _
_ _ O _ _ _
_ _ O _ _ _
_ _ O _ _ _
`

grid.deserialise(load_data)

print_grid(grid)

var n = 1
for (let i in [...Array(n).values()]) {
    grid.grid_update()
    print_grid(grid)
}


for (const i in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
        const element = object[key];
        
    }
}