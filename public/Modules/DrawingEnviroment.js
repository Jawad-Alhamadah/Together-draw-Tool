 const {hexToRGB} = require("./PixelFunctions")
 let {Mouse} = require("./Classes/Mouse")
 let {Tools} = require("./Classes/Tools")

 var $ = require("jquery")
 class DrawingEnviroment {
     constructor(canvWidth, canvHeight, mouseX, mouseY, userName, color,correctionX,correctionY) {
         this.mouse = new Mouse(mouseX, mouseY,correctionX,correctionY)
         this.tools = new Tools()
         this.isNamePicked = false
         this.canvWidth = canvWidth
         this.canvHeight = canvHeight
         this.userName = userName
         this.color = hexToRGB(color, 255)
         this.savedColor=hexToRGB(color, 255)
         this.brushSize = 2
         this.palletColorsList=[]
         this.brushSizeUpperLimit=6
         this.brushSizeLowerLimit=2
         this.chatLimit=20
         this.chatCounter=0
         
     }

     fillWithWhite(ctx) {
         ctx.canvas.width = 1094
         ctx.canvas.height = 500
         ctx.strokeRect(20, 20, 1040, 445)
         ctx.fillStyle = "white"
         ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
         ctx.fillStyle = "black"
     }
     CreatePalletDivs() {
         this.PushColors(this.palletColorsList)
         for (var i = 0; i < this.palletColorsList.length; i++) this.createIndividualColorPalletDiv(this.palletColorsList,i) 
     }

    PushColors(col){
        col.push('#000000');col.push('#FFFFFF');col.push('#999900');col.push('#4C9900');col.push('#004C99');
        col.push('#009900');col.push('#00994C');col.push('#009999');col.push('#80FF00');col.push('#99004C')
        col.push('#000099');col.push('#4C0099');col.push('#990099');col.push('#0080FF');col.push('#58906F');
        col.push('#FF0000');col.push('#FF8000');col.push('#FFFF00');col.push('#FFFF99');col.push('#99FFFF');
        col.push('#00FF00');col.push('#00FF80');col.push('#00FFFF');col.push('#FF99FF');col.push('#1B46D6');
        col.push('#0000FF');col.push('#7F00FF');col.push('#FF00FF');col.push('#AF21ED');col.push('#D64A2D');
        col.push('#FF007F');col.push('#FF9999');col.push('#FFCC99');col.push('#F046D3');col.push('#F07D22');
        col.push('#CCFF99');col.push('#99FF99');col.push('#99FFCC');col.push('#E66250');col.push('#E6C412');
        col.push('#99CCFF');col.push('#9999FF');col.push('#CC99FF');col.push('#52E629');col.push('#10D65B');
        col.push('#FF99CC');col.push('#663CE6');col.push('#1413ED');col.push('#FD99FD');col.push('#7BD60B');
        col.push('#2986F0');col.push('#12A6E3');col.push('#7729D6');col.push('#E6BE35');col.push('#9F475F');
        col.push('#DC0099');col.push('#DC49E6');col.push('#C72DE3');col.push('#D6332D');col.push('#D62F3B');
        col.push('#D63574');col.push('#D62F8B');col.push('#1AF045');col.push('#BFD60B');col.push('#D69815');
        col.push('#E612C3');col.push('#F03C7D');col.push('#E64B07');col.push('#E6456C');col.push('#0EE612');
        col.push('#E67D4E');col.push('#F0E216');col.push('#D68715');
      }
    
    createIndividualColorPalletDiv(palletColorsList,i) {
        var colorpallentTemp = document.getElementById("ColorPallet")
        let tempPallet = document.createElement("div")
        colorpallentTemp.appendChild(tempPallet)
        tempPallet.id = palletColorsList[i].substring(1)
        tempPallet.style.backgroundColor = "#" + tempPallet.id
        $("#" + tempPallet.id).click((e) => this.setBrushColor(hexToRGB("#" + e.target.id, 255)))
    }
    setBrushColor = (desiredColor)=> this.color= desiredColor
    
 }
 module.exports = {
     DrawingEnviroment
 }