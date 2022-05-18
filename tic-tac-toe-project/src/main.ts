import Phaser from 'phaser';

const gameStatusDiv = document.getElementById('gameStatus') as HTMLElement;

class GameOverScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameOver',
      active: false,
    });
  }

  public create(data: { winnerText: string }): void {
    const { width, height } = this.scale;
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '32px',
      color: '#000000',
    };

    this.add.text(width * 0.5, height * 0.3, data.winnerText, textStyle).setOrigin(0.5);
    this.add.text(width * 0.5, height * 0.5, 'Click to play again', textStyle).setOrigin(0.5);
    this.input.once(Phaser.Input.Events.POINTER_DOWN as string, (): void => {
      this.scene.start('Game');
    });
  }
}

class GameScene extends Phaser.Scene {
  // state, 0 = empty, 1 = x (player 1), 2 = o (player 2)
  private board: number[][] = [];
  // 1 = player x, 2 = player o
  private playersTurn!: number;
  // keep track of each rectangle(cell) size
  private initialBorderWidth = 6;
  private initialBorderHeight = 6;
  private widthRectangle = 0;
  private heightRectangle = 0;
  // overall game state
  private isGameFinished!: boolean;
  // 0 = initial state, 1 = player 1 won, 2 = player 2 won, 3 = draw
  private gameWinner!: number;
  private playedTiles: Phaser.GameObjects.Image[][] = [];

  constructor() {
    super({
      key: 'Game',
      active: false,
    });
  }

  public init(): void {
    this.isGameFinished = false;
    this.gameWinner = 0;
    this.playersTurn = 1;
    this.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    this.playedTiles = [[], [], []];
  }

  public preload(): void {
    this.load.spritesheet('weapons', 'assets/images/weapons/fantasy_weapons_pack1_noglow.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('weapons-glow', 'assets/images/weapons/fantasy_epicweapons_pack1_nobg.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  public create(): void {
    this.createGameBoard();
    gameStatusDiv.innerText = `Player ${this.playersTurn}'s turn`;
  }

  private createGameBoard(): void {
    const { width, height } = this.scale;
    console.log(width, height);

    // calculate the width for each rectangle, based on the game scale
    const widthReminder = width % 3;
    if (widthReminder === 1) {
      this.initialBorderWidth += 0.5;
    } else if (widthReminder === 2) {
      this.initialBorderWidth += 1;
    }
    this.widthRectangle = (width - this.initialBorderWidth * 2) / 3;

    // calculate the height for each rectangle, based on the game scale
    const heightReminder = height % 3;
    if (heightReminder === 1) {
      this.initialBorderHeight += 0.5;
    } else if (heightReminder === 2) {
      this.initialBorderHeight += 1;
    }
    this.heightRectangle = (height - this.initialBorderHeight * 2) / 3;

    console.log(this.widthRectangle, this.heightRectangle);

    // create the rectangles for the game board
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const rectangle = this.add.rectangle(
          x * this.widthRectangle + this.initialBorderWidth * x,
          y * this.heightRectangle + this.initialBorderHeight * y,
          this.widthRectangle,
          this.heightRectangle,
          0x808080,
        );
        rectangle.setOrigin(0);
        rectangle.setInteractive();
        rectangle.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN as string, () => {
          this.handleBoardClick(x, y);
        });
      }
    }
  }

  private handleBoardClick(x: number, y: number): void {
    if (this.board[x][y] === 0 && !this.isGameFinished) {
      this.board[x][y] = this.playersTurn;

      // 32px for the image, calculate where to place the image
      const weaponSpriteX = x * this.widthRectangle + this.initialBorderWidth * x + (this.widthRectangle - 32) / 2;
      const weaponSpriteY = y * this.heightRectangle + this.initialBorderHeight * y + (this.heightRectangle - 32) / 2;
      const frame = this.playersTurn === 1 ? 0 : 49;
      const image = this.add.image(weaponSpriteX, weaponSpriteY, 'weapons', frame).setOrigin(0.5).setScale(5);
      this.playedTiles[x][y] = image;

      // update players turn
      this.playersTurn = this.playersTurn === 1 ? 2 : 1;
      gameStatusDiv.innerText = `Player ${this.playersTurn}'s turn`;

      this.checkForGameOver();
    }
  }

  private checkForGameOver(): void {
    // check for possible win combinations
    // if all values in a row are the same
    if (this.board[0][0] !== 0 && this.board[0][0] === this.board[0][1] && this.board[0][0] === this.board[0][2]) {
      this.gameWinner = this.board[0][0];
      this.playedTiles[0][0].setTexture('weapons-glow', this.playedTiles[0][0].frame.name);
      this.playedTiles[0][1].setTexture('weapons-glow', this.playedTiles[0][1].frame.name);
      this.playedTiles[0][2].setTexture('weapons-glow', this.playedTiles[0][2].frame.name);
    } else if (
      this.board[1][0] !== 0 &&
      this.board[1][0] === this.board[1][1] &&
      this.board[1][0] === this.board[1][2]
    ) {
      this.gameWinner = this.board[1][0];
      this.playedTiles[1][0].setTexture('weapons-glow', this.playedTiles[1][0].frame.name);
      this.playedTiles[1][1].setTexture('weapons-glow', this.playedTiles[1][1].frame.name);
      this.playedTiles[1][2].setTexture('weapons-glow', this.playedTiles[1][2].frame.name);
    } else if (
      this.board[2][0] !== 0 &&
      this.board[2][0] === this.board[2][1] &&
      this.board[2][0] === this.board[2][2]
    ) {
      this.gameWinner = this.board[2][0];
      this.playedTiles[2][0].setTexture('weapons-glow', this.playedTiles[2][0].frame.name);
      this.playedTiles[2][1].setTexture('weapons-glow', this.playedTiles[2][1].frame.name);
      this.playedTiles[2][2].setTexture('weapons-glow', this.playedTiles[2][2].frame.name);
    }

    // if all values in a column are the same
    else if (this.board[0][0] !== 0 && this.board[0][0] === this.board[1][0] && this.board[0][0] === this.board[2][0]) {
      this.gameWinner = this.board[0][0];
      this.playedTiles[0][0].setTexture('weapons-glow', this.playedTiles[0][0].frame.name);
      this.playedTiles[1][0].setTexture('weapons-glow', this.playedTiles[1][0].frame.name);
      this.playedTiles[2][0].setTexture('weapons-glow', this.playedTiles[2][0].frame.name);
    } else if (
      this.board[0][1] !== 0 &&
      this.board[0][1] === this.board[1][1] &&
      this.board[0][1] === this.board[2][1]
    ) {
      this.gameWinner = this.board[0][1];
      this.playedTiles[0][1].setTexture('weapons-glow', this.playedTiles[0][1].frame.name);
      this.playedTiles[1][1].setTexture('weapons-glow', this.playedTiles[1][1].frame.name);
      this.playedTiles[2][1].setTexture('weapons-glow', this.playedTiles[2][1].frame.name);
    } else if (
      this.board[0][2] !== 0 &&
      this.board[0][2] === this.board[1][2] &&
      this.board[0][2] === this.board[2][2]
    ) {
      this.gameWinner = this.board[0][2];
      this.playedTiles[0][2].setTexture('weapons-glow', this.playedTiles[0][2].frame.name);
      this.playedTiles[1][2].setTexture('weapons-glow', this.playedTiles[1][2].frame.name);
      this.playedTiles[2][2].setTexture('weapons-glow', this.playedTiles[2][2].frame.name);
    }

    // if all values in a diagonal are the same
    else if (this.board[0][0] !== 0 && this.board[0][0] === this.board[1][1] && this.board[0][0] === this.board[2][2]) {
      this.gameWinner = this.board[0][0];
      this.playedTiles[0][0].setTexture('weapons-glow', this.playedTiles[0][0].frame.name);
      this.playedTiles[1][1].setTexture('weapons-glow', this.playedTiles[1][1].frame.name);
      this.playedTiles[2][2].setTexture('weapons-glow', this.playedTiles[2][2].frame.name);
    } else if (
      this.board[0][2] !== 0 &&
      this.board[0][2] === this.board[1][1] &&
      this.board[0][2] === this.board[2][0]
    ) {
      this.gameWinner = this.board[0][2];
      this.playedTiles[0][2].setTexture('weapons-glow', this.playedTiles[0][2].frame.name);
      this.playedTiles[1][1].setTexture('weapons-glow', this.playedTiles[1][1].frame.name);
      this.playedTiles[2][0].setTexture('weapons-glow', this.playedTiles[2][0].frame.name);
    }

    // check to see if all the cells are filled, which results in a draw
    const isBoardFilled = this.board.every((row) => row.every((cell) => cell !== 0));
    if (isBoardFilled && this.gameWinner === 0) {
      this.gameWinner = 3;
    }

    if (this.gameWinner !== 0) {
      this.isGameFinished = true;
      if (this.gameWinner === 3) {
        gameStatusDiv.innerText = 'Draw!';
      } else {
        gameStatusDiv.innerText = this.gameWinner === 1 ? 'Player 1 won!' : 'Player 2 won!';
      }

      this.time.delayedCall(3000, () => {
        this.scene.start('GameOver', { winnerText: gameStatusDiv.innerText });
      });
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    parent: 'game',
    width: 800,
    height: 600,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: '#E5E5F2',
  scene: [GameScene, GameOverScene],
};

export default new Phaser.Game(config);
