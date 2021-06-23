
const {Bucket} = require("./Bucket")
const {Eraser} = require("./Eraser")
const {ColorPicker} = require("./ColorPicker")
const {Brush} = require("./Brush")
  
class Tools {
    constructor() {
        this.brush=new Brush('BrushTool.png','BrushTool',true,"")
        this.bucket=new Bucket('paint-bucket-4.png','BucketTool',false,"paint-bucket-4.png")
        this.eraser=new Eraser('eraser.png','EraserTool',false,"")
        this.colorPicker=new ColorPicker('color-picker.png','ColorPickerTool',false,"dropper.png")
          }
    activateBrush(event,DrawingEnviroment) {
        this.brush.isActive       = true
        this.eraser.isActive      = false
        this.colorPicker.isActive = false
        this.bucket.isActive      = false
        this.brush.activationSetUp(event,DrawingEnviroment)
    }
    activateEraser(event,DrawingEnviroment) {
        this.eraser.isActive      = true 
        this.brush.isActive       = false
        this.colorPicker.isActive = false
        this.bucket.isActive      = false
        this.eraser.activationSetUp(event,DrawingEnviroment)
       
    }
    activateColorPicker(event,DrawingEnviroment) {
        this.colorPicker.isActive = true
        this.brush.isActive       = false
        this.eraser.isActive      = false
        this.bucket.isActive      = false
        this.colorPicker.activationSetUp(event,DrawingEnviroment)
    }
    activateBucket(event,DrawingEnviroment) {
        this.bucket.isActive      = true
        this.brush.isActive       = false
        this.eraser.isActive      = false
        this.colorPicker.isActive = false  
        this.bucket.activationSetUp(event,DrawingEnviroment)
    }
     
  }
  module.exports = {
    Tools
  }