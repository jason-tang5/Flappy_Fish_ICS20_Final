let pipes = [];
let ground = [];
let bird;
let mousePress;
let mode;
let point;
let score;



function preload() {
  //Load sounds
  soundFormats('wav');
  bonk = loadSound('collision.wav');
  swim = loadSound('swim.wav');
  pipe_pass = loadSound('pass.wav');
  
  //Load images
  menu = loadImage('menu.png');
  sand = loadImage('sand.png');
  title = loadImage('Flappy-fish.png');
  play = loadImage('Click-anywhere.png');
  game_over = loadImage('Game over.png');
  restart = loadImage('restart.png');
  pipe_body = loadImage('pipe_body.png');
  pipe_header1 = loadImage('pipe_header1.png');
  pipe_header2 = loadImage('pipe_header2.png');
  pufferfish = loadImage('PP.png');
  wBack = loadImage('water background.png');
}

function setup() {
  rectMode(CENTER);
  imageMode(CENTER);
  //Canvas size is able to change without issues
  createCanvas(475, 600);
  startGame = false;
  menuStart = false;
  //Set important values to default
  play_size = 0.01;
  play_scale = 0;
  highscore = 0;
  point = 0;
  //Make new objects
  score = new Points();
  ground = new Ground();
  bird = new Bird(width/2, height/2, 40, 0.4);
  mode = 0;   
}

function draw() {
  background(225);
   
  //Starting screen/menu
    if(mode == 0) { 
  
  //background images
  image(wBack,width/2,height/2, width, height);
  image(title,width/2,100, 425,80);
  image(pufferfish,width/2,height/2,60,60);
  image(sand,0, height - 20,width,50);
  image(sand,width, height - 20,width,50);
  image(play,width/2, 400, 300*play_size,80*play_size);
   
  //makes "click anywhere to play" increase and decrease in size using sin
   play_scale += 0.03;
   play_size = sin(play_scale);  
      
  //Starts the game if screen is clicked
  if(startGame == true) {
    mode = 1;
    startGame = false;
  }
      
  } 
  
  //Game screen
   else if (mode == 1) { 
     
  //Background image
  image(wBack,width/2,height/2, width, height);
  
  //Character movement
  bird.update();
  bird.show();
  bird.move();
  bird.ceiling();
    
  //Adds a new pipe to the array of pipes every 70 frames
    if (frameCount % 70 == 0) {
    pipes.push(new Pipe());
  }
    
  //Ground collision
  if(bird.hits(ground)) {
    bonk.play();
    mode = 2;
    pipes.splice(0,100);   
  }  
  
  //Shows and moves the pipes, also counts score
    for (let i = 0; i < pipes.length; i++) { 
      pipes[i].update();
      pipes[i].show();
      pipes[i].passes();
  
   //Collision with character   
      if (pipes[i].collides(bird)) {
      pipes.splice(0,100);
      bonk.play();
      bird.y = height/2;
      mode = 2;
   }   
}   
    
  //Displays the ground
    ground.update();
    ground.show();
    ground.reset();
     
  //Displays the score 
    score.print();  
    
  //Game over screen
  } else if(mode == 2) {
    
  //Changes highscore if highscore was beat
    if(point > highscore) {
      highscore = point;
 }
    //Background
    image(wBack,width/2,height/2, width, height);
    image(sand,width/2, height - 20,width,50);
  
    //Game over rectangle
    push();
    fill(255,255,255,100);
    strokeWeight(3);
    stroke(60);
    rect(width/2, 120, 250,170);
    image(game_over,width/2,120);
    pop();
    
    //Score rectangle
    push();
    fill(255,255,255,100);
    rect(width/2,300,200,150);
    fill(0);
    textSize(25);
    text('High Score:', width/2 - 78,280);
    text(highscore,width/2 + 60,280);
    text('Score:', width/2 - 55,335);
    text(point,width/2 + 30,335);
    pop();
  
    //Restart rectangle
    push();
    //Changes color if mouse is over the rectangle
    fill(255,255,255,100);
    if(mouseX > width/2 - 75 && 
       mouseX < width/2 + 75 &&
       mouseY > 401 &&
       mouseY < 439) {
      fill(255,255,255);
    }
    rect(width/2,420,150,38);
    image(restart,width/2,420);
    pop();
    //Sets the game back to the game screen
    if(mouseX > width/2 - 75 && 
       mouseX < width/2 + 75 &&
       mouseY > 401 &&
       mouseY < 439 && mouseIsPressed) {
      mode = 1; 
      point = 0;
    }

  //Menu rectangle
    push();
  //Changes color if mouse is over the rectangle
    fill(255,255,255,100);
     if(mouseX > width/2 - 75 && 
       mouseX < width/2 + 75 &&
       mouseY > 461 &&
       mouseY < 499) {
      fill(255,255,255);
    }
    rect(width/2, 480,150,38);
    image(menu,width/2,480);
    pop();
    
  //Changes mode to the start screen
     if(mouseX > width/2 - 75 && 
       mouseX < width/2 + 75 &&
       mouseY > 461 &&
       mouseY < 499 && startGame == true) {
     startGame = false;
     mode = 0;
     point = 0;
    }     
  }
 
}


//This is necessary so one click is only registered once
function mousePressed() { 
 
 mousePress = true;
 if (mode == 0) {
   startGame = true;
 }
  
//Detection if the click was within the menu rectangle
 if (mode == 2 && mouseX > width/2 - 75 && 
       mouseX < width/2 + 75 &&
       mouseY > 461 &&
       mouseY < 499) {
   startGame = true;
 }
}

//////////////////////////////////////////////////////////////////////
//All the constructors below



//Bird constructor - could add a second player if needed
//change xPos and yPos to change starting position, change bRad for hitbox size, and change accel to have faster gravity
function Bird(xPos,yPos,bRad,accel) {
  this.x = xPos;
  this.y = yPos;
  this.r = bRad;
  this.vel = 0;
  this.accel = accel;
//Gravity and acceleration
  this.update = function() {
    this.vel += this.accel;
    this.y += this.vel;
  }
//Displays the character  
  this.show = function() {
    ellipse(this.x,this.y,this.r);
    image(pufferfish,this.x,this.y,this.r+20,this.r+20);
  }
//Makes the character jump after a mouse click
  this.move = function() {
    if (mousePress == true) {
    this.vel = -8;
    swim.play();
    mousePress = false;
    
    }
  } 
//Collision detection with the ground
  this.hits = function(ground) {
    if (this.y > ground.y - ground.h/2) {
      this.y = height/2;
      return true;   
    } 
  }
//Stops the character from going through the top of the screen
  this.ceiling = function() {
    if(this.y < 0) {
      this.vel = 0;
    }
  }
  
}




//Pipe constructor
function Pipe() {
  this.h1 = random(75,725);
  this.h2 = 800 - this.h1;
  this.w = 40;
  this.x = width + 100;
  this.y1 = 0;
  this.y2 = height;
  this.xspeed = 4.5;
   //Pipe movement
   this.update = function() {
      this.x -= this.xspeed;   
  }
  
   this.show = function() {  
      //Hitboxes
      rect(this.x, this.y1, this.w, this.h1);
      rect(this.x, this.y2, this.w, this.h2);
     
      //Header and body of pipe 1 (the one on top)
      image(pipe_body, this.x, this.y1, this.w+5, this.h1);
      image(pipe_header1, this.x, this.y1 + this.h1/2, this.w +10, 30);
     
      //Header and body of pipe 2 (the one on the bottom)
      image(pipe_body, this.x, this.y2, this.w+5, this.h2);   
      image(pipe_header2, this.x, this.y2 - this.h2/2, this.w + 10, 30); 
      
  }
   //Collision with bird
   this.collides = function(bird) {
     //Top pipe collision
     if(this.x + this.w/2 > bird.x - bird.r/1.5 && 
        this.x - this.w/2 < bird.x + bird.r/1.5 &&
        this.y1 + this.h1/2 > bird.y - bird.r &&
        this.y1 - this.h1/2 < bird.y + bird.r || 
        
     //Bottom pipe collision
        this.x + this.w/2 > bird.x - bird.r/1.5 && 
        this.x - this.w/2 < bird.x + bird.r/1.5 &&
        this.y2 + this.h2/2 > bird.y - bird.r &&
        this.y2 - this.h2/2 < bird.y + bird.r) {
       return true;
     }
     
   }
   //Returns a new point value after the character passes through it
  this.passes = function() {
    if(this.x < width/2 + 1.5 && this.x > width/2 - 1.5) {
      pipe_pass.play();
      point +=1;
     return point;
    }
    
  }
  
}
  //Ground constructor
  function Ground() {
    
    this.w = width;
    this.h = 40;
    this.x = width/2;
    this.y = height-this.h/2;
    
    this.show = function() {
      image(sand,this.x + this.w/2,this.y,this.w,this.h+ 10);
      image(sand,this.x - this.w/2, this.y,this.w,this.h + 10);   
    }
  
   this.update = function() {
     this.x -= 4.5;
   }
    //Teleports back to the right side after crossing the left side
    this.reset = function() {
      if (this.x < 0) {
      this.x = width;
     }
   }
    
  }

//Point constructor
 function Points() {
   this.x = width/2;
   this.y = 55;
   
   this.print = function() {
     push();
     fill(255);
     textSize(40);
     text(point,this.x,this.y);
     pop();
   }
 }
  
