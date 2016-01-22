// start slingin' some d3 here.
var Player = function() {
  this.x = 0.5;
  this.y = 0.5;
};

var Asteroid = function() {
  this.x = Math.random();
  this.y = Math.random();
};

Asteroid.prototype.move = function() {
  this.x = Math.random();
  this.y = Math.random();
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
  .attr("width", "50px")
  .attr("height", "50px")
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
};


asteroidMove();

//create player
var player = new Player();

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
  .attr("r", "10px")
  .classed('.player');







