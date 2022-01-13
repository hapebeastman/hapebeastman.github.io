import MovingDirection from "./MovingDirection.js";

export default class Enemy {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.#loadEnemyImages();
    //this.#loadImages();

    this.enemyAnimationTimerDefault = 10;
    this.enemyAnimationTimer = null;

    this.movingDirection = Math.floor(
      Math.random() * Object.keys(MovingDirection).length
    ) % Object.keys(MovingDirection).length;

    this.directionTimerDefault = this.#random(10, 25);
    this.directionTimer = this.directionTimerDefault;

    this.scaredAboutToExpireTimerDefault = 10;
    this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;

    this.isScared = 0;
  }

  draw(ctx, pause, pacman) {
    if (!pause) {
      this.#move();
      this.#changeDirection();
      this.#animate();
    }
    this.#setImage(ctx, pacman);
    
    const size = this.tileSize / 2;

    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    
    if (this.movingDirection == 2) ctx.scale(-1, 1);
    else ctx.rotate((this.movingDirection * 90 * Math.PI) / 180);
    
    ctx.drawImage(
      this.image,
      -size,
      -size,
      this.tileSize,
      this.tileSize
    );

    ctx.restore();
  }

  collideWith(pacman) {
    const size = this.tileSize / 2;
    if (
      this.x < pacman.x + size &&
      this.x + size > pacman.x &&
      this.y < pacman.y + size &&
      this.y + size > pacman.y
    ) {
      return true;
    } else {
      return false;
    }
  }

  #loadEnemyImages() {
    const enemyImage1 = new Image();
    enemyImage1.src = "images/ghost0.png";

    const enemyImage2 = new Image();
    enemyImage2.src = "images/ghost1.png";

    const enemyImage3 = new Image();
    enemyImage3.src = "images/ghost2.png";

    const enemyImage4 = new Image();
    enemyImage4.src = "images/ghost1.png";

    this.enemyImages = [
      enemyImage1,
      enemyImage2,
      enemyImage3,
      enemyImage4,
    ];

    const enemyGhostImage1 = new Image();
    enemyGhostImage1.src = "images/scaredGhost0.png";

    const enemyGhostImage2 = new Image();
    enemyGhostImage2.src = "images/scaredGhost1.png";

    const enemyGhostImage3 = new Image();
    enemyGhostImage3.src = "images/scaredGhost2.png";

    const enemyGhostImage4 = new Image();
    enemyGhostImage4.src = "images/scaredGhost1.png";

    this.enemyGhostImages = [
      enemyGhostImage1,
      enemyGhostImage2,
      enemyGhostImage3,
      enemyGhostImage4,
    ];

    const enemyGhostImage21 = new Image();
    enemyGhostImage21.src = "images/scaredGhost20.png";

    const enemyGhostImage22 = new Image();
    enemyGhostImage22.src = "images/scaredGhost21.png";

    const enemyGhostImage23 = new Image();
    enemyGhostImage23.src = "images/scaredGhost22.png";

    const enemyGhostImage24 = new Image();
    enemyGhostImage24.src = "images/scaredGhost21.png";

    this.enemyGhostImages2 = [
      enemyGhostImage21,
      enemyGhostImage22,
      enemyGhostImage23,
      enemyGhostImage24,
    ];

    this.enemyImageIndex = 0;
    this.image = this.enemyImages[this.enemyImageIndex];
  }

  #setImage(ctx, pacman) {
    if (pacman.powerDotActive) {
      this.#setImageWhenPowerDotIsActive(pacman);
    } else {
      this.image = this.enemyImages[this.enemyImageIndex];
    }
    //ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
  }

  #setImageWhenPowerDotIsActive(pacman) {
    if (pacman.powerDotAboutToExpire) {
      this.scaredAboutToExpireTimer--;
      if (this.scaredAboutToExpireTimer === 0) {
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
        if (this.isScared == 0) {
          this.image = this.enemyGhostImages[this.enemyImageIndex];
          this.isScared = 1;
        }else {
          this.image = this.enemyGhostImages2[this.enemyImageIndex];
          this.isScared = 0;
        }
      }
    } else {
      this.image = this.enemyGhostImages[this.enemyImageIndex];
    }
  }

  #changeDirection() {
    this.directionTimer--;
    let newMoveDirection = null;
    if (this.directionTimer == 0) {
      this.directionTimer = this.directionTimerDefault;
      newMoveDirection = Math.floor(
        Math.random() * Object.keys(MovingDirection).length
      );
    }

    if (newMoveDirection != null && this.movingDirection != newMoveDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            newMoveDirection
          )
        ) {
          this.movingDirection = newMoveDirection;
        }
      }
    }
  }

  #move() {
    if (
      this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.movingDirection
      )
    ) {
      this.enemyAnimationTimer = null;
      this.enemyImageIndex = 1;
      return;
    } else if (
      this.movingDirection != null &&
      this.enemyAnimationTimer == null
    ) {
      this.enemyAnimationTimer = this.enemyAnimationTimerDefault;
    }

    switch (this.movingDirection) {
      case MovingDirection.up:
        this.y -= this.velocity;
        break;
      case MovingDirection.down:
        this.y += this.velocity;
        break;
      case MovingDirection.left:
        this.x -= this.velocity;
        break;
      case MovingDirection.right:
        this.x += this.velocity;
        break;
    }
  }

  #random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  #animate() {
    console.log("enemyAnimationTimer" + this.enemyAnimationTimer);
    if (this.enemyAnimationTimer == null) {
      return;
    }
    this.enemyAnimationTimer--;
    if (this.enemyAnimationTimer == 0) {
      this.enemyAnimationTimer = this.enemyAnimationTimerDefault;
      this.enemyImageIndex++;
      if (this.enemyImageIndex == this.enemyImages.length)
        this.enemyImageIndex = 0;
    }
  }

//  #loadImages() {
//    this.normalGhost = new Image();
//    this.normalGhost.src = "images/ghost.png";
//
//    this.scaredGhost = new Image();
//    this.scaredGhost.src = "images/scaredGhost.png";
//
//    this.scaredGhost2 = new Image();
//    this.scaredGhost2.src = "images/scaredGhost2.png";
//
//    this.image = this.normalGhost;
//  }
}
