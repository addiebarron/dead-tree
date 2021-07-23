// L-system

class LSystem {
  constructor(alphabet, axiom, rules) {
    // parameters
    this.alphabet = alphabet;
    this.axiom = axiom;
    this.rules = rules;

    // initial state
    this.state = axiom;
  }

  iter(n = 1, v = false) {
    if (v) {
      console.log(`Starting state: ${this.state}`);
      console.log(`Rules: `);
      for (let rule in this.rules) {
        console.log(`\t${rule} --> ${this.rules[rule]}`);
      }
      console.log(`Applying rules ${n} time${n != 1 ? "s" : ""}...`);
    }

    for (let i = 0; i < n; i++) {
      let keys = Object.keys(this.rules);
      let re = new RegExp(`${keys.join("|")}`, "g");

      this.state = this.state.replace(re, (key) => this.rules[key]);

      if (v) console.log(`New State: ${this.state}`);
    }

    if (v) console.log(`Final state: ${this.state}`);

    this.n = n;
  }

  init(n) {
    this.i = 0;
    this.state = this.axiom;
    if (n) this.iter(n);
  }

  next(drawFunc) {
    if (this.i <= this.state.length) {
      let char = this.state[this.i];
      drawFunc(char);
      this.i++;
    }
  }
}

const artist = {
  init: () => {
    this.length = baseLength;
    for (i = 0; i < L.n; i++) pop();
    resetMatrix();
    background(50);
    stroke(255, 100);
    translate(width / 2, height);
    push();
  },
  draw: (char) => {
    switch (char) {
      case "F":
        //stroke("saddlebrown");
        line(0, 0, 0, -length);
        translate(0, -length);
        break;

      case "+":
        rotate(phi);
        break;

      case "-":
        rotate(-phi);
        break;

      case "[":
        push();
        this.length *= lengthVar;
        break;

      case "]":
        pop();
        this.length /= lengthVar;
        break;

      case "L":
      // draw a flower
      // petalSize = 4;
      // noStroke();
      // fill("pink");
      // ellipse(-petalSize / 2, -petalSize / 2, petalSize);
      // ellipse(petalSize / 2, -petalSize / 2, petalSize);
      // ellipse(-petalSize / 2, petalSize / 2, petalSize);
      // ellipse(petalSize / 2, petalSize / 2, petalSize);
      // fill("brown");
      // ellipse(0, 0, petalSize / 2);

      default:
        break;
    }
  },
  length: 100,
};

// Init

let depth, phi, baseLength, lengthVar, speed, drawOnce, inputs;

const L = new LSystem("FL+-[]", "F", {
  F: "F[+F-F+FFL][-FF+F-FL]",
});

// Initialize DOM elements and read input values
function DOMinit() {
  createCanvas(windowWidth, windowHeight);

  inputs = {
    phi: select("#phiSlider"),
    speed: select("#speedSlider"),
    length: select("#lengthSlider"),
    depth: select("#depthSlider"),
    drawOnce: select("#drawOnceCheck"),
    reset: select("#resetBtn"),
  };

  inputs.reset.elt.onclick = (e) => {
    e.preventDefault();
    initSketch();
  };
}

// Load the form params into memory
const updateParams = () => {
  phi = inputs.phi.value();
  speed = inputs.speed.value();
  baseLength = inputs.length.value();
  //depth = inputs.depth.value();
  depth = 5;
  drawOnce = inputs.drawOnce.checked();
  lengthVar = 0.5;
};

// Reset the entire sketch with params from the form
function initSketch() {
  updateParams();
  L.init(depth);
  artist.init();
}

function setup() {
  DOMinit();
  initSketch();
}

function draw() {
  pop();
  if (inputs.drawOnce.checked()) {
    speed = L.state.length;
  } else {
    speed = inputs.speed.value();
  }
  for (let i = 0; i < speed; i++) {
    L.next(artist.draw);
  }
  push();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initSketch();
}
