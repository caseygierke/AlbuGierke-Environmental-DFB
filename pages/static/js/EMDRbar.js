

window.onload = function() {
    document.getElementById("start-stop").addEventListener("click", startStop);
    document.getElementById("background-color").addEventListener("change", changeBackgroundColor);
    document.getElementById("ball-color").addEventListener("change", changeColor);
    document.getElementById("speed").addEventListener("change", changeSpeed);
    document.getElementById("repetitions").addEventListener("change", changeReps);
}


// global variables that will be loaded/initialized later
let canvas, ctx, ball
let move = false;
let repetitions = 30;
let speed = 10;
// Define color
color = 'blue';
backgroundColor = 'grey';

// runs once at the beginning
// loads any data and kickstarts the loop
function init () {
  
  // Create dropdown for background color options
  var select = document.getElementById("background-color"); 
  var colors = ['Grey', 'Red', 'Blue', 'Green', 'White', 'Black', 'Purple'];
  
  // Enhanced/ More pythonic approach to for loop
  colors.forEach(function (color){
      var opt = color;
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      select.appendChild(el);
  });

  // // Typical javascript approach to loop
  // for (var i = 0; i < colors.length; i++) {
  //     var opt = colors[i];
  //     var el = document.createElement("option");
  //     el.textContent = opt;
  //     el.value = opt;
  //     select.appendChild(el);
  // }​

  // Create dropdown for ball color options
  var select = document.getElementById("ball-color"); 
  var colors = ['Blue', 'Grey', 'Red', 'Green', 'White', 'Black', 'Purple'];
  
  // Enhanced/ More pythonic approach to for loop
  colors.forEach(function (color){
      var opt = color;
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      select.appendChild(el);
  });
  
  // Create dropdown for speeds
  var select = document.getElementById("speed"); 
  var speeds = ['Medium', 'Low', 'High']

  // Enhanced/ More pythonic approach to for loop
  speeds.forEach(function (speed){
      var opt = speed;
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      select.appendChild(el);
  });
  
  // Edit here for full screen
  canvas = document.getElementById("screenCanvas");
  
  canvas.width = document.body.clientWidth; 
//   canvas.height = document.body.clientHeight*0.85; 
  canvasW = canvas.width;
  canvasH = canvas.height;

  if( canvas.getContext ) {}

  // Create ctx object
  ctx = canvas.getContext('2d')

  // starting objects
  ball = {
    radius: 30,
    x: canvas.width / 2,
    y: canvas.height / 2,
    velX: 0,
    velY: 0
  }
  ball2 = {
    radius: 30,
    x: canvas.width / 2 + ball.radius*2,
    y: canvas.height / 2,
    velX: 0,
    velY: 0
  }

  // begin update loop
  window.requestAnimationFrame(update)
}

// draws stuff to the screen
// allows us to separate calculations and drawing
function draw () {
  // clear the canvas and redraw everything
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Define background color
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);  
  
  // draw the ball (only object in this scene)
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc(
    ball.x, ball.y,
    ball.radius,
    0, Math.PI * 2
  )
  ctx.arc(
    ball2.x, ball2.y,
    ball2.radius,
    0, Math.PI * 2
  )
  ctx.fill()
}

// the main piece of the loop
// runs everything
function update () {
  // queue the next update
  window.requestAnimationFrame(update)

  // left bound
  if (ball.x - ball.radius <= 0) {
    ball.velX = -ball.velX;
    ball2.velX = ball.velX;
    ball.x = ball.radius
    ball2.x = ball.radius*3
  }
  // right bound
  if (ball2.x + ball.radius >= canvas.width) {
    ball.velX = -ball.velX;
    ball2.velX = ball.velX;
    ball.x = canvas.width - 3*ball.radius;
    ball2.x = canvas.width - ball.radius;
  }

  // Count repetitions
  if (repetitions > 0) {
    if (ball.x < (canvas.width/2)+ball.velX/2 && ball.x > (canvas.width/2)-ball.velX/2) {
      // console.log(repetitions);
      repetitions --;
    }
  }

  // Check if repetitions is 0
  if (repetitions == 0) {
    move = false;
  }

  if (move == false) {
    if (ball.velX > 0) {
      if (ball.x < (canvas.width/2)+ball.velX/2 && ball.x > (canvas.width/2)-ball.velX/2) {
        ball.velX = 0;
        ball2.velX = 0;
      }
    }
  }
  // update ball position
  ball.x += ball.velX;
  ball2.x += ball2.velX;
  // draw after logic/calculations
  draw()
}

// start our code once the page has loaded
document.addEventListener('DOMContentLoaded', init)

// Define startStop
function startStop() {
  if (move == false) {
    move = true;
    if (ball.velX < 0) {
      speed = -speed
    }
    ball.velX = speed;
    ball2.velX = speed;
    document.getElementById("start-stop").innerText = 'Stop'
  }
  else {
    move = false;
    document.getElementById("start-stop").innerText = 'Start'
  }
}

function changeColor() {
  color = document.getElementById("ball-color").value;
}

function changeSpeed() {
  selection = document.getElementById("speed").value;
  if (selection == 'Low') {
    speed = 6;
    if (ball.velX < 0) {
      speed = -speed
    }
    ball.velX = speed;
    ball2.velX = speed;
  } 
  if (selection == 'High') {
    speed = 15;
    if (ball.velX < 0) {
      speed = -speed
    }
    ball.velX = speed;
    ball2.velX = speed;
  }
  if (selection == 'Medium') {
    speed = 10;
    if (ball.velX < 0) {
      speed = -speed
    }
    ball.velX = speed;
    ball2.velX = speed;
  }
}

function changeBackgroundColor() {
  backgroundColor = document.getElementById("background-color").value;
}

function changeReps() {
  repetitions = document.getElementById("repetitions").value;
}