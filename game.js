// Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    render: {
        pixelArt: true,
        antialias: false
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let wasdKeys;
let flowers;
let score = 0;
let scoreText;
let pickupRadius = 80;

function preload() {
    // No external assets needed - we'll draw everything
}

function create() {
    // Create garden background
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x228B22, 1); // Forest green
    graphics.fillRect(0, 0, 1000, 700);
    
    // Add grass pattern
    graphics.fillStyle(0x32CD32, 0.8);
    for (let i = 0; i < 100; i++) {
        const x = Phaser.Math.Between(0, 1000);
        const y = Phaser.Math.Between(0, 700);
        graphics.fillCircle(x, y, Phaser.Math.Between(15, 40));
    }
    
    graphics.generateTexture('gardenBg', 1000, 700);
    graphics.destroy();
    
    this.add.image(500, 350, 'gardenBg');

    // Create player
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    playerGraphics.fillStyle(0xFF6B9D, 1); // Pink body
    playerGraphics.fillRect(0, 0, 30, 40);
    playerGraphics.fillStyle(0xFFDBBF, 1); // Skin color
    playerGraphics.fillCircle(15, 12, 10); // Head
    playerGraphics.fillStyle(0x000000, 1);
    playerGraphics.fillCircle(11, 10, 3); // Left eye
    playerGraphics.fillCircle(19, 10, 3); // Right eye
    playerGraphics.generateTexture('player', 30, 40);
    playerGraphics.destroy();

    player = this.physics.add.sprite(500, 350, 'player');
    player.setCollideWorldBounds(true);
    player.setBounce(0);
    player.setDrag(0.99);

    // Create flowers group
    flowers = this.physics.add.group();
    createFlowers(this, flowers);

    // Input
    cursors = this.input.keyboard.createCursorKeys();
    wasdKeys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.input.keyboard.on('keydown-SPACE', () => {
        pickupFlowers(player, flowers);
    });

    // Score text
    scoreText = this.add.text(16, 16, `Flowers Collected: ${score}`, {
        fontSize: '20px',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
    });
    scoreText.setScrollFactor(0);
    scoreText.setDepth(100);
}

function createFlowers(scene, group) {
    // Create flower texture
    const flowerGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    
    // Yellow center
    flowerGraphics.fillStyle(0xFFD700, 1);
    flowerGraphics.fillCircle(15, 15, 8);
    
    // Red petals
    flowerGraphics.fillStyle(0xFF1493, 1);
    flowerGraphics.fillCircle(15, 5, 5);
    flowerGraphics.fillCircle(25, 10, 5);
    flowerGraphics.fillCircle(25, 20, 5);
    flowerGraphics.fillCircle(15, 25, 5);
    flowerGraphics.fillCircle(5, 20, 5);
    flowerGraphics.fillCircle(5, 10, 5);
    
    flowerGraphics.generateTexture('flower', 30, 30);
    flowerGraphics.destroy();

    // Spawn flowers randomly
    for (let i = 0; i < 15; i++) {
        let x, y, validSpawn;
        
        do {
            validSpawn = true;
            x = Phaser.Math.Between(50, 950);
            y = Phaser.Math.Between(50, 650);
            
            // Don't spawn too close to center
            if (Phaser.Math.Distance.Between(x, y, 500, 350) < 100) {
                validSpawn = false;
            }
        } while (!validSpawn);
        
        const flower = group.create(x, y, 'flower');
        flower.setScale(0.8);
        flower.setTint(Phaser.Math.Between(0, 1) ? 0xFF1493 : 0xFF69B4);
    }
}

function pickupFlowers(player, flowerGroup) {
    flowerGroup.children.entries.forEach(flower => {
        const distance = Phaser.Math.Distance.Between(
            player.x, player.y,
            flower.x, flower.y
        );
        
        if (distance < pickupRadius) {
            flower.destroy();
            score++;
            scoreText.setText(`Flowers Collected: ${score}`);
            
            // Create particle effect
            const scene = flower.scene;
            for (let i = 0; i < 5; i++) {
                scene.add.particles(0xFF1493).createEmitter({
                    x: flower.x,
                    y: flower.y,
                    speed: { min: -100, max: 100 },
                    angle: { min: 0, max: 360 },
                    scale: { start: 1, end: 0 },
                    lifespan: 300,
                    gravityY: 100
                });
            }
        }
    });
    
    // Spawn new flowers occasionally
    if (flowerGroup.children.entries.length < 15) {
        const scene = player.scene;
        let x, y, validSpawn;
        
        do {
            validSpawn = true;
            x = Phaser.Math.Between(50, 950);
            y = Phaser.Math.Between(50, 650);
            
            if (Phaser.Math.Distance.Between(x, y, 500, 350) < 100) {
                validSpawn = false;
            }
        } while (!validSpawn);
        
        const newFlower = flowerGroup.create(x, y, 'flower');
        newFlower.setScale(0.8);
        newFlower.setTint(Phaser.Math.Between(0, 1) ? 0xFF1493 : 0xFF69B4);
    }
}

function update() {
    // Player movement
    const speed = 200;
    let velocityX = 0;
    let velocityY = 0;

    if (cursors.left.isDown || wasdKeys.left.isDown) {
        velocityX = -speed;
    } else if (cursors.right.isDown || wasdKeys.right.isDown) {
        velocityX = speed;
    }

    if (cursors.up.isDown || wasdKeys.up.isDown) {
        velocityY = -speed;
    } else if (cursors.down.isDown || wasdKeys.down.isDown) {
        velocityY = speed;
    }

    player.setVelocity(velocityX, velocityY);

    // Draw pickup radius indicator (visual feedback)
    if (player.scene.isActive()) {
        const graphics = player.scene.children.list.find(child => child.type === 'Graphics');
        if (!graphics) {
            const newGraphics = player.scene.make.graphics({ x: 0, y: 0, add: true });
            newGraphics.lineStyle(2, 0xFFD700, 0.3);
            newGraphics.strokeCircle(player.x, player.y, pickupRadius);
        }
    }
}