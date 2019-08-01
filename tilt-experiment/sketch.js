
let penX = 0;
let penY = 0;
let penTiltX = 0;
let penTiltY = 0;

let penLength = 600;

let canvas;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.elt.addEventListener("pointermove",  pointerMoved);
}

function draw() {
    background(220);
    stroke(0);
    cross(penX, penY, 100, 100);
    let dx = penLength * sin(penTiltX);
    let dy = penLength * sin(penTiltY);
    push();
    strokeWeight(50);
    stroke(0, 30);
    line(penX, penY, penX + dx, penY + dy);
    pop();
}

function cross(x, y, w, h) {
    line(x - w/2, y, x + w/2, y);
    line(x, y - h/2, x, y + h/2);
}

function pointerMoved(evt) {
    if(evt.pointerType === 'pen') penMoved(evt);
}

function penMoved(evt) {
    console.log(evt);
    getPenPos(evt);
}


function getPenPos(evt) {
    var rect = canvas.elt.getBoundingClientRect();
    penX = floor(evt.clientX - rect.left);
    penY = floor(evt.clientY - rect.top);
    penTiltX = radians(evt.tiltX);   // (-HALF_PI ... +HALF_PI)
    penTiltY = -radians(evt.tiltY);  // (-HALF_PI ... +HALF_PI)
}