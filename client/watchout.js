
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


Player.prototype.collisionCheck = function(asteroid) {
  var asteroidX = asteroid.x + asteroid.side / 2;
  var asteroidY = asteroid.y + asteroid.side / 2;
  var asteroidR = asteroid.side / 2;
  var distance = Math.pow(this.x - asteroidX, 2) + Math.pow(this.y - asteroidY, 2);
  var check1 = Math.pow(this.r - asteroidR, 2) <= distance;
  var check2 = Math.pow(this.r + asteroidR, 2) >= distance;
  return check1 && check2;
};

var Asteroid = function() {
  this.x = Math.random() * 0.8 + 0.1;
  this.y = Math.random() * 0.8 + 0.1;
  this.side = 0.1;
};

Asteroid.prototype.move = function(){
  this.x = Math.random() * 0.8 + 0.1;
  this.y = Math.random() * 0.8 + 0.1;
};

var player = new Player();
var svg = d3.select('.board');
var width = parseInt(svg.style('width'));
var height = parseInt(svg.style('height'));



//create asteroids
var asteroids = [];
for (var i=0; i < 5; i++) {
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
  svg.selectAll('.asteroid').each(function (asteroid) {
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

setInterval(asteroidMove, 1000);
setInterval(function () {
  d3.selectAll('.asteroid')
    .each(function(jsElem) {
      var domElem = d3.select(this);
      jsElem.x = parseInt(domElem.attr('x')) / width;
      jsElem.y = parseInt(domElem.attr('y')) / height;
      if (gameOn) {
        if (player.collisionCheck(jsElem)) {
           //set high score to current score
          highScore = currentScore > highScore ? currentScore : highScore;
          //set current score to 0
          currentScore = 0;
          collisions++;
          d3.select('.highscore span').text(highScore);
          d3.select('.current span').text(currentScore);      
          d3.select('.collisions span').text(collisions);
          gameOn = false;
          setTimeout(function() {
            gameOn = true;
          }, 1000);
        } else {
          currentScore++;
          d3.select('.current span').text(currentScore);
        }        
      }
    });

}, 10);


//create player
var player = new Player();

var drag = d3.behavior.drag()
              .on('drag', function() {
                var cx = d3.event.x;
                var cy = d3.event.y;
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
  .call(drag)
  .classed('.player');







