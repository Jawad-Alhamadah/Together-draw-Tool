class Mouse {
  constructor(mouseX, mouseY, CorrectionX, CorrectionY) {
    this.x = mouseX;
    this.y = mouseY;
    this.previousX = mouseX;
    this.previousX = mouseY;
    this.isDown = false;
    this.CorrectionX = CorrectionX
    this.CorrectionY = CorrectionY
  }
}

module.exports = {
  Mouse
}