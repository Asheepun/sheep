import getCanvas     			 from "/js/lib/canvas.js";
import getWorld      			 from "/js/lib/gameWorld.js";
import { smallWolf, sniperWolf } from "/js/enemy.js";
import vec, * as v   			 from "/js/lib/vector.js";
import keyBinder     			 from "/js/lib/keyBinder.js";
import * as loaders  			 from "/js/lib/assets.js";
import generateWorld 			 from "/js/generateWorld.js"
import spawner 		 			 from "/js/spawner.js";
import * as hud 				 from "/js/hud.js";
import sheep 					 from "/js/sheep.js";

Promise.all([
	getCanvas(600, 300),
	loaders.loadAudio(
		0.3,
		"shoot",
		"enemy_shoot",
	)
]).then(([ { c, ctx, pointer, width, height }, audio ]) => {

	audio.setVolume();
	
	const GAME = {
		c,
		ctx,
		pointer,
		width,
		height,
		audio,
		world: getWorld(),
		state: undefined,
		states: {
		
		},
	};

	const map = [
		"..............................",
		"..............................",
		"..............................",
		"..............................",
		"______________________________",
		"..............................",
		"..............................",
		"..............................",
		".........._________...........",
		"...@..........................",
		"..............................",
		"..............................",
		"..............................",
		"##############################",
		"##############################",
	];

	generateWorld(map, GAME.world);

	for(let i = 0; i < 3; i++){
		GAME.world.add(sheep(vec(240 + i*40, 240)), "sheep", 3);
	}

	//add hud
	GAME.world.add(hud.ammoBar(vec(5, 5)), "hud", 10);

	//add spawners
	GAME.world.add(spawner({
		pos: vec(-60, 210),
		types: [smallWolf],
		delay: 140,
		dir: 1,
	}), "spawners", 0);

	GAME.world.add(spawner({
		pos: vec(630, 210),
		types: [smallWolf],
		delay: 140,
		dir: -1,
	}), "spawners", 0);

	GAME.world.add(spawner({
		pos: vec(0, 0),	
		types: [sniperWolf],
		delay: 900,
		dir: 1,
	}), "spawners", 0)

	GAME.world.add(spawner({
		pos: vec(580, 0),	
		types: [sniperWolf],
		delay: 900,
		dir: -1,
	}), "spawners", 0)

	const keys = keyBinder();

	keys.bind({
		keys: ["D", "d"],	
		down: () => GAME.world.player.dir++,
		up: () => GAME.world.player.dir--,
	});

	keys.bind({
		keys: ["A", "a"],	
		down: () => GAME.world.player.dir--,
		up: () => GAME.world.player.dir++,
	});

	keys.bind({
		keys: ["W", "w", " "],	
		down: GAME.world.player.jump,
		up: GAME.world.player.stopJump,
	});

	keys.bind({
		keys: ["S", "s"],	
		down: () => GAME.world.player.downing = true,
		up: () => GAME.world.player.downing = false,
	});

	keys.bind({
		keys: ["O", "o"],
		down: () => GAME.world.player.shooting = true,
		up: () => GAME.world.player.shooting = false,
	});

	keys.bind({
		keys: ["P", "p"],
		down: GAME.world.player.gun.reload,
	});

	GAME.states.game = () => {
		GAME.world.update(GAME);

		ctx.save();
		ctx.scale(c.scale, c.scale)
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, width, height)
		GAME.world.draw(ctx, GAME);
		ctx.restore();

	}

	GAME.states.pause = () => {
	
	}

	GAME.state = GAME.states.game;

	const loop = () => {
		if(!document.hasFocus()) GAME.state = GAME.states.pause;
		GAME.state(GAME);
		setTimeout(loop, 1000/60);
	}

	loop();

});
