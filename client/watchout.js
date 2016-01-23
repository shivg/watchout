
//global variables
var currentScore = 0;
var highScore = 0;
var collisions = 0;
var gameOn = true;

// start slingin' some d3 here.
var Player = function() {
  this.x = 0.5;
  this.y = 0.5;
  this.r = 0.025;
};

var collisionWorker = new Worker('collisionWorker.js');



Player.prototype.collisionCheck = function() {
  asteroidD3Selection
    .each(function(jsElem) {
      var domElem = d3.select(this);
      jsElem.x = parseInt(domElem.attr('x')) / width;
      jsElem.y = parseInt(domElem.attr('y')) / height;
      if (gameOn) {

        if (window.Worker){
          
          collisionWorker.postMessage([jsElem, player.x, player.y, player.r]);

          collisionWorker.onmessage = function (e) {

            if(e.data){
              highScore = currentScore > highScore ? currentScore : highScore;
              //set current score to 0
              currentScore = 0;
              collisions++;
              highScoreD3.text(highScore);
              currentD3.text(currentScore);      
              collisionD3.text(collisions);
              gameOn = false;
              setTimeout(function() {
                gameOn = true;
              }, 1000);
            } else {
              currentScore++;
              currentD3.text(currentScore);
              }   
            }
        }
      }
    });
  };



var Asteroid = function() {
  this.x = Math.random() - 0.05;
  this.y = Math.random() - 0.05;
  this.side = 0.1;
  };

Asteroid.prototype.move = function(){
  this.x = Math.random() - 0.05;
  this.y = Math.random() -  0.05;
};
//create player
var player = new Player();


var svg = d3.select('.board');
var width = parseInt(svg.style('width'));
var height = parseInt(svg.style('height'));



//create asteroids
var asteroids = [];
for (var i=0; i < 10; i++) {
  asteroids.push(new Asteroid());
}


//add asteroids to board
svg.selectAll('.asteroid')
  .data(asteroids)
  .enter()
  .append('svg:image')
  .attr("xlink:href", "asteroid.png")
  .attr("x", function (asteroid) {
    return asteroid.x * width+"px";
  })
  .attr("y", function (asteroid) {
    return asteroid.y * height+"px";
  })
  .attr("width", function(d) {
    return d.side * width + "px";
  })
  .attr("height", function(d) {
    return d.side * height + "px";
  })
  .attr('class', 'asteroid');

//make asteroids move

var asteroidMove = function () {
  asteroidD3Selection.each(function (asteroid) {
    asteroid.move();
    var element = d3.select(this);
    element.transition()
      .duration(1000)
      .attr("x", function (asteroid) {
        return asteroid.x * width+"px";
      })
      .attr("y", function (asteroid) {
        return asteroid.y * height+"px";
      });
  });
  return false;
};


// get references
var asteroidD3Selection = d3.selectAll('.asteroid');
var highScoreD3 = d3.select('.highscore span');
var currentD3 = d3.select('.current span');
var collisionD3 = d3.select('.collisions span');




//move asteroids
setInterval(asteroidMove, 1000);

//check for collisions, incriment scores
setInterval(function () { 
  player.collisionCheck.call();
}, 100);


//create player
var drag = d3.behavior.drag()
              .on('drag', function() {
                var cx = d3.event.x < width && d3.event.x > 0 ? d3.event.x : player.x * width;
                var cy = d3.event.y < height && d3.event.y > 0 ? d3.event.y : player.y * height;
                player.x = cx / width;
                player.y = cy / height;
                d3.select(this)
                .attr('cx', cx)
                .attr('cy', cy);
              });

//add player to board
svg.selectAll('.player')
  .data([player])
  .enter()
  .append('circle')
  .attr("cx", function (player) {
    return player.x * width+"px";
  })
  .attr("cy", function (player) {
    return player.y * height+"px";
  })
  .attr("r", function(player) {
    return player.r * (height + width) / 2 + 'px';
  })
  .attr("fill", "green")
  .call(drag)
  .classed('.player');







