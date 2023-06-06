window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    car.start();
  };

  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const background = new Image();
  background.src = "./images/road.png";

  class Car {
    constructor() {
      this.x = 230;
      const img = document.createElement("img");
      img.addEventListener("load", () => {
        this.img = img;
      });
      img.src = "./images/car.png";
    }

    draw() {
      ctx.drawImage(
        this.img,
        this.x,
        600,
        this.img.width / 4,
        this.img.height / 4
      );
    }

    moveRight() {
      const maxX = 380;
      const newX = this.x + 50;
      if (newX <= maxX) {
        this.x = newX;
      }
    }

    moveLeft() {
      const minX = 80;
      const newX = this.x - 50;
      if (newX >= minX) {
        this.x = newX;
      }
    }

    start() {
      this.interval = setInterval(updateCanvas, 20);
      this.score = 0;
    }

    incrementScore() {
      this.score += 1;
    }
  }

  class Obstacle {
    constructor(x, width) {
      this.x = x;
      this.y = 0;
      this.width = width;
      this.height = 20;
      this.speed = 5;
    }

    draw() {
      ctx.fillStyle = "red";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
      this.y += this.speed;
    }

    hasCollision(car) {
      if (
        this.y + this.height >= 600 &&
        this.y <= 600 + car.img.height / 4 &&
        this.x + this.width >= car.x &&
        this.x <= car.x + car.img.width / 4
      ) {
        return true;
      }
      return false;
    }
  }

  function setBackground() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  }

  const car = new Car();
  const obstacles = [];

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowRight":
        car.moveRight();
        break;

      case "ArrowLeft":
        car.moveLeft();
        break;
    }
  });

  function createObstacle() {
    const obstacleWidth = Math.random() * (100 - 50) + 50;
    const obstacleX = Math.random() * (canvas.width - obstacleWidth);
    const obstacle = new Obstacle(obstacleX, obstacleWidth);
    obstacles.push(obstacle);
  }

  function updateCanvas() {
    ctx.clearRect(0, 0, 500, 700);
    setBackground();
    car.draw();

    obstacles.forEach((obstacle) => {
      obstacle.move();
      obstacle.draw();

      if (obstacle.hasCollision(car)) {
        clearInterval(car.interval);
        console.log("Game Over");
      } else if (obstacle.y >= 620) {
        car.incrementScore();
      }
    });

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${car.score}`, 20, 40);

    if (Math.random() < 0.03) {
      createObstacle();
    }
  }
};
