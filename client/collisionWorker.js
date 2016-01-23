
onmessage = function(e) {
  // console.log('Message received from main script');
  var asteroid = e.data[0];
  var playerX = e.data[1];
  var playerY = e.data[2];
  var playerR = e.data[3]; 

  var asteroidX = asteroid.x + asteroid.side / 2;
  var asteroidY = asteroid.y + asteroid.side / 2;
  var asteroidR = asteroid.side / 2;
  var distance = Math.pow(playerX - asteroidX, 2) + Math.pow(playerY - asteroidY, 2);
  var check1 = Math.pow(playerR - asteroidR, 2) <= distance;
  var check2 = Math.pow(playerR + asteroidR, 2) >= distance;
  var collisionBoolean = check1 && check2;

  postMessage(collisionBoolean);
};