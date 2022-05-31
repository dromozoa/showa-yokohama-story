const cw = 1280
const ch = 720
const th = 64
const lh = 96

const canvas = new Canvas(cw, ch)
canvas.fillStyle = "black"
canvas.fillRect(0, 0, cw, ch)

canvas.font = th + "px BIZUDPMincho-Regular"
canvas.textAlign = "center"
canvas.textBaseline = "middle"
canvas.fillStyle = "white"
canvas.fillText("昭和横濱物語", cw / 2, ch / 2 - lh / 2)
canvas.fillText("昭和横濱物語", cw / 2, ch / 2 + lh / 2)

const output = new Output(canvas, 'output.png')
output.addToQueue()
