const LENGTH = 20;
let cols, rows;
let grid;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  
  cols = floor(windowWidth / LENGTH);
  rows = floor(windowHeight / LENGTH);
  
  grid = new Array(cols);
  for (let i=0; i<cols; i++) {
    grid[i] = new Array(rows);
  }
  
  
  for (let i=0; i<cols; i++) {
    for (let j=0; j<rows; j++) {
//       let xPos = windowWidth/ROWS*x + windowWidth/(ROWS*2);
//       let yPos = windowHeight/COLUMNS*y + windowHeight/(COLUMNS*2)
// 
// 
//       // circle(xPos, yPos, 5);
//       line(xPos, yPos, mouseX, mouseY);
      
      grid[i][j] = new Arrow(i,j);
      grid[i][j].show();
    }
  }
}

function vector_field(x, y) {
  x = map(x, 0, windowWidth, -3, 3);
  y = map(y, 0, windowHeight, -3, 3);
  
  let u = PI * sin(y);
  let v = x * x;
  
  return createVector(u, v);
}

class Arrow {
  constructor(_i, _j) {
    this.i = _i; 
    this.j = _j;
    this.x = (this.i + 0.5) * LENGTH;
    this.y = (this.j + 0.5) * LENGTH;
    this.vector = vector_field(this.x, this.y);
    this.mag = this.vector.mag();
    this.arg = this.vector.heading();
  }
  
  show() {
    if(this.mag != 0) {
      push();
      strokeWeight(1);
      stroke(0);
      
      let r = 4;
      let l = LENGTH;
      let buffer = 5;
      
      let mouseVector = createVector(mouseX - windowWidth/2, mouseY - windowHeight/2);
      
      translate((this.i + 0.5) * l, (this.j + 0.5) * l);

      let mouseArg = mouseVector.heading();
      
      
      rotate(mouseArg);
      // rotate(this.arg);
      line(-l/2 + buffer, 0, l/2 - buffer, 0);
      
      translate(l/2 - buffer, 0);
      
      let a = radians(150);
      let x1 = r * cos(a);
      let y1 = r * sin(a);
      
      line(0, 0, x1, y1);
      line(0, 0, x1, -y1);
      
      pop();
    }
  }
}