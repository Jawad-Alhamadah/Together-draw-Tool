
const {Bucket} = require("./Bucket")
const {Eraser} = require("./Eraser")
const {ColorPicker} = require("./ColorPicker")
const {Brush} = require("./Brush")
  
class Tools {
    constructor() {
        this.brush = new Brush('BrushTool-2.png', 'BrushTool', true, "")
        this.bucket = new Bucket('paint-bucket-4.png', 'BucketTool', false, "paint-bucket-4.png")
        this.eraser = new Eraser('eraser.png', 'EraserTool', false, "")
        this.colorPicker = new ColorPicker('color-picker.png', 'ColorPickerTool', false, "dropper.png")
    }
    activateBrush(DrawingEnviroment) {
        this.brush.isActive = true
        this.eraser.isActive = false
        this.colorPicker.isActive = false
        this.bucket.isActive = false
        this.brush.activationSetUp(DrawingEnviroment)
    }
    activateEraser(DrawingEnviroment) {
        this.eraser.isActive = true
        this.brush.isActive = false
        this.colorPicker.isActive = false
        this.bucket.isActive = false
        this.eraser.activationSetUp(DrawingEnviroment)

    }
    activateColorPicker(DrawingEnviroment) {
        this.colorPicker.isActive = true
        this.brush.isActive = false
        this.eraser.isActive = false
        this.bucket.isActive = false
        this.colorPicker.activationSetUp(DrawingEnviroment)
    }
    activateBucket(DrawingEnviroment) {
        this.bucket.isActive = true
        this.brush.isActive = false
        this.eraser.isActive = false
        this.colorPicker.isActive = false
        this.bucket.activationSetUp(DrawingEnviroment)
    }

}
module.exports = {
    Tools
}