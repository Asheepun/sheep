import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";
import player, { playerArm } 	from "/js/player.js";
import * as hud 				from "/js/hud.js";
import * as text 				from "/js/lib/text.js";
import * as enemies				from "/js/enemy.js";

const setupTutorial = (GAME) => {

	GAME.world.clearAll();

	const ground = traitHolder();
	traits.addEntityTrait({
		pos: vec(0, 220),
		size: vec(600, 80),
	})(ground);

	GAME.world.add(ground, "obstacles", 0);

	GAME.world.add(player(vec(285, 120)), "player", 6, true);
	GAME.world.add(playerArm(), "playerArm", 8, true);
	
	GAME.world.add(hud.ammoBar(vec(5, 5)), "ammobar", 10, true);
	
	GAME.state = tutorial;
}

let walked = 60 * 10;
let shooted = 0;
let trapped = 0;
let firstEnemy = false;
let lastEnemiesCounter = 0;
let lastEnemies = false;

const tutorial = (GAME, ctx) => {
	walked--;
	shooted--;
	trapped--;
	lastEnemiesCounter--;

	if(walked === 0) shooted = 60 * 10;

	if(shooted === 0){
		GAME.world.add(enemies.wolf(vec(0, 150)), "enemies", 4);
		GAME.world.enemies[0].dir = 1;
		firstEnemy = true;
	}

	if(firstEnemy && GAME.world.enemies.length === 0){
		firstEnemy = false;
		trapped = 60 * 7;
		GAME.progress.traps = 3;
		GAME.world.add(hud.trapBar(vec(0, 20)), "trapBar", 10, true);
	}

	if(trapped === 0){
		lastEnemiesCounter = 11*30;
		lastEnemies = true;
	}

	if(lastEnemiesCounter > 0 && lastEnemiesCounter % 30 === 0){
		const enemy = enemies.wolf(vec(0, 150), "enemies", 4);
		enemy.dir = 1;
		GAME.world.add(enemy, "enemies", 4);
	}

	if(lastEnemies && GAME.world.enemies.length === 0){
		localStorage.tutorial = true;
		GAME.fadeToState("setupStart", 0.001);
	}


	GAME.handlePlayerKeys(GAME);

	GAME.world.update(GAME);

	ctx.save();
	ctx.scale(GAME.c.scale, GAME.c.scale);
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, GAME.width, GAME.height);

	if(walked > 0){
		text.white20("Move with WASD", 220, 70, ctx);
	}
	if(shooted > 0){
		text.white20("Shoot with O", 230, 50, ctx);
		text.white20("Reload with P", 230, 80, ctx);
	}
	if(trapped > 0){
		text.white20("Set Traps with L", 210, 70, ctx);
	}

	GAME.world.draw(ctx, GAME.sprites);

	ctx.restore();
}

export default setupTutorial;
