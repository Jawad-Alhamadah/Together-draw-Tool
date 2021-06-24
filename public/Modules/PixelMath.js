function calcStraightLine(startCoordinates, endCoordinates, color, BrushSize) {
    var coordinatesArray = new Array()
    // Translate coordinates
    var x1 = startCoordinates.left
    var y1 = startCoordinates.top
    var x2 = endCoordinates.left
    var y2 = endCoordinates.top
    // Define differences and error check
    var dx = Math.abs(x2 - x1)
    var dy = Math.abs(y2 - y1)
    var sx = (x1 < x2) ? 1 : -1
    var sy = (y1 < y2) ? 1 : -1
    var err = dx - dy
    // Set first coordinates
    coordinatesArray.push({
        x: x1,
        y: y1,
        color: color,
        BrushSize: BrushSize
    })
    // Main loop
    while (!((x1 == x2) && (y1 == y2))) {
        var e2 = err << 1
        if (e2 > -dy) {
            err -= dy
            x1 += sx
        }
        if (e2 < dx) {
            err += dx
            y1 += sy
        }
        // Set coordinates
        coordinatesArray.push({
            x: x1,
            y: y1,
            color: color,
            BrushSize: BrushSize
        })
    }
    // Return the result
    return coordinatesArray
}

function GetBoolIndex(x, y, canvWidth) {
    return (y * canvWidth) + x

}

function GetBoolXY(index) {
    var y = index / canvWidth
    var x = index % canvWidth
    return {
        x: x,
        y: y
    }
}

module.exports = {
    GetBoolIndex,
    GetBoolXY,
    calcStraightLine
}