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
    // Debug logging
    if (v) {
      console.log(`Starting state: ${this.state}`);
      console.log(`Rules: `);
      for (let rule in this.rules) {
        console.log(`\t${rule} --> ${this.rules[rule]}`);
      }
      console.log(`Applying rules ${n} time${n != 1 ? "s" : ""}...`);
    }

    // Handle rules
    for (let i = 0; i < n; i++) {
      let newState = "";
      // only handle single-character rules for now
      for (let j = 0; j < this.state.length; j++) {
        let char = this.state.charAt(j);
        let rule = this.rules[char];
        // probabilistic rules
        if (typeof rule == "object") {
          let roll = Math.random() * 100;
          for (let chance of rule) {
            if (roll < chance.prob) {
              newState += chance.rule;
              break;
            } else {
              roll -= chance.prob;
            }
          }
          // standard rules
        } else if (typeof rule == "string") {
          newState += this.rules[char];
        } else {
          newState += char;
        }
      }

      this.state = newState;
      if (v) console.log(`New State: ${this.state}`);
    }

    if (v) console.log(`Final state: ${this.state}`);

    this.n = n;
  }

  init(n) {
    this.i = 0;
    this.state = this.axiom;
    if (n) this.iter(n, true);
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
        line(0, 0, 0, -branchLength);
        translate(0, -branchLength);
        break;

      case "+":
        rotate(phi);
        break;

      case "-":
        rotate(-phi);
        break;

      case "[":
        push();
        branchLength *= scaleVar;
        break;

      case "]":
        pop();
        branchLength /= scaleVar;
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
};

// Init

let depth, phi, branchLength, scaleVar, speed, inputs;

let L = new LSystem("FL+-[]L", "F", {
  F: [
    {
      prob: 60,
      rule: "F[+F-F+FF][-FF+F-F]",
    },
    {
      prob: 40,
      rule: "F",
    },
  ],
});

// Initialize DOM elements and read input values
function DOMinit() {
  createCanvas(windowWidth, windowHeight);

  inputs = {
    phi: select("#phiSlider"),
    speed: select("#speedSlider"),
    scale: select("#scaleSlider"),
    reset: select("#resetBtn"),
  };

  inputs.reset.elt.onclick = (e) => {
    e.preventDefault();
    initSketch();
  };
}

// Reset params to slider values
const updateParams = () => {
  depth = 6;
  scaleVar = 0.5;

  phi = inputs.phi.value();
  speed = inputs.speed.value();
  branchLength = inputs.scale.value();
};

// Reset the entire sketch with params from the form
function initSketch() {
  updateParams();
  L.init(depth);
  artist.init();
}

// p5 Structure functions
function setup() {
  DOMinit();
  initSketch();
}

function draw() {
  // noLoop();
  pop();
  speed = inputs.speed.value();
  for (let i = 0; i < speed; i++) {
    L.next(artist.draw);
  }
  push();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initSketch();
}
