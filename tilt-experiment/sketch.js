let penX = 0;
let penY = 0;
let penTiltX = 0;
let penTiltY = 0;
let penTiltAngle = 0;
let penRotationAngle = 0;
let penLength = 400;
let penPressure = 1.0;

let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.addEventListener("pointermove", pointerMoved);
}

function draw() {
  background(220);
  stroke(0);
  cross(penX, penY, 100, 100);
  drawShadow();
}

function drawShadow() {
    push();
    strokeWeight(50);
    stroke(255, 0, 0, 30);
    let dx2 = penLength * sin(penTiltAngle) * cos(penRotationAngle);
    let dy2 = penLength * sin(penTiltAngle) * sin(penRotationAngle);
    line(penX, penY, penX + dx2, penY + dy2);
    pop();
}

function cross(x, y, w, h) {
  line(x - w / 2, y, x + w / 2, y);
  line(x, y - h / 2, x, y + h / 2);
}

function pointerMoved(evt) {
  if (evt.pointerType === 'pen') penMoved(evt);
}

function penMoved(evt) {
  getPenPos(evt);
  getPenAngles(evt);
}

function getPenPos(evt) {
  let {clientX, clientY, tiltX, tiltY} = evt;
  const rect = canvas.elt.getBoundingClientRect();
  penX = floor(clientX - rect.left);
  penY = floor(clientY - rect.top);
}

function getPenAngles(evt) {
  let {clientX, clientY, tiltX, tiltY} = evt;
  penTiltX = radians(tiltX); // (-HALF_PI ... +HALF_PI)
  penTiltY = radians(tiltY); // (-HALF_PI ... +HALF_PI)
  let a = tan(penTiltY);
  let b = tan(penTiltX);
  penTiltAngle = atan(sqrt(a * a + b * b));
  penRotationAngle = atan2(a, b);
}

function getPenPressure(evt) {
  let {pressure} = evt;
  console.log(pressure);
}
