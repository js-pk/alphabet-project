const LENGTH = 20;
let cols, rows;
let grid;

let max = 100;
let textIndex = 0;
let colorRValue = 0;

let texts = ["released", "from", "obligation", "charge", "or", "penalty", "the", "act", "or", "an", "instance", "of", "quitting", "a", "job", "I'm", "ready", "to", "quit", "already", "I", "quit", "smoking", "and", "I'm", "taking", "it", "out", "on", "everyone", "behave", "in", "a", "specified", "way", "leave", "to", "stop", "doing", "something", "or", "leave", "a", "job", "or", "a", "place", "depart", "drop","drop", "out", "give", "up", "go", "pull", "out", "relinquish", "renounce", "retire", "surrender", "vacate", "withdraw", "abandon", "break", "off", "cease", "conclude", "discontinue", "halt", "leave", "suspend", "You", "don't", "know", "me", "so", "quit", "trying", "to", "act", "like", "you", "do"]
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(colorRValue, 0, 0);
  frameRate(25);
}

function draw() {
  if (!mouseIsPressed) {
    max -= 1;
    textIndex += 1;
    stroke(1);
    rect(mouseX - 250, mouseY - 125, 500,250);
    line(mouseX+250-24, mouseY-125+12, mouseX+250-12, mouseY-125+24);
    line(mouseX+250-12, mouseY-125+12, mouseX+250-24, mouseY-125+24);
    textSize(100);
    textAlign('center');
    (textIndex < texts.length) ? textIndex : textIndex = 0;
    text(texts[textIndex], mouseX, mouseY+40);
    // if (max < 0) {
    //   end();
    // }
  }
}

function mousePressed() {
  end();
  stroke(1);
  rect(mouseX - 250, mouseY - 125, 500,250);
  line(mouseX+250-24, mouseY-125+12, mouseX+250-12, mouseY-125+24);
  line(mouseX+250-12, mouseY-125+12, mouseX+250-24, mouseY-125+24);
  textIndex += 1;
  textSize(100);
  textAlign('center');
  (textIndex < texts.length) ? textIndex : textIndex = 0;
  text(texts[textIndex], mouseX, mouseY+40);
}

function end() {
  colorRValue+10<255 ? colorRValue += 10 : colorRValue = 255;
  background(colorRValue,0,0);
  max = 100;
}