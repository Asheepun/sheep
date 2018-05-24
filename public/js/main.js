import getCanvas     			 from "/js/lib/canvas.js";
import getWorld      			 from "/js/lib/gameWorld.js";
import { smallWolf, sniperWolf } from "/js/enemy.js";
import vec, * as v   			 from "/js/lib/vector.js";
import keys		     			 from "/js/lib/keys.js";
import * as loaders  			 from "/js/lib/assets.js";
import generateWorld 			 from "/js/generateWorld.js"
import spawnHandler 			 from "/js/spawnHandler.js";
import * as hud 				 from "/js/hud.js";
import sheep 					 from "/js/sheep.js";
import clock					 from "/js/clock.js";

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


	GAME.keys = keys(
		"D",
		"d",
		"A",
		"a",
		"W",
		"w",
		" ",
		"S",
		"s",
		"O",
		"o",
		"P",
		"p",
	);

	GAME.states.start = () => {
		if(GAME.keys[" "].downed){
			GAME.state = GAME.states.setup;
		}

		ctx.save();
		ctx.scale(c.scale, c.scale)
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, GAME.width, GAME.height)
		ctx.fillStyle = "white";
		ctx.font = "15px Arial";
		ctx.fillText("Move with WASD", 215, 100);
		ctx.fillText("Shoot with O Reload with P", 182, 130);
		ctx.font = "20px Arial";
		ctx.fillText("Press space to begin", 180, 200);
		ctx.restore();

	}

	GAME.states.setup = () => {
		GAME.world.clearAll();
		
		//add tiles and player
		generateWorld(map, GAME.world);

		for(let i = 0; i < 3; i++){
			GAME.world.add(sheep(vec(240 + i*40, 240)), "sheep", 3);
		}

		//add hud
		GAME.world.add(hud.ammoBar(vec(5, 5)), "hud", 10);

		GAME.world.add(clock(vec(210, 17)), "hud", 10);

		//add spawners
		GAME.world.add({
			pos: vec(-60, 210),
			types: [smallWolf],
			dir: 1,
		}, "bottomSpawners", 0);

		GAME.world.add({
			pos: vec(630, 210),
			types: [smallWolf],
			dir: -1,
		}, "bottomSpawners", 0);

		GAME.world.add({
			pos: vec(0, 0),	
			types: [sniperWolf],
			dir: 1,
		}, "topSpawners", 0)

		GAME.world.add({
			pos: vec(580, 0),	
			types: [sniperWolf],
			dir: -1,
		}, "topSpawners", 0)

		GAME.world.add(spawnHandler(), "spawnHandler", 0, true);

		GAME.state = GAME.states.night;
	}

	GAME.states.night = () => {

		//keys
		
		//jump
		if(GAME.keys.W.downed || GAME.keys.w.downed || GAME.keys[" "].downed){
			GAME.world.player.jump();
		}
		if(GAME.keys.W.upped || GAME.keys.w.upped || GAME.keys[" "].upped){
			GAME.world.player.stopJump();
		}
		//move
		if(GAME.keys.A.down || GAME.keys.a.down){
			GAME.world.player.dir = -1;
		}
		if(GAME.keys.D.down || GAME.keys.d.down){
			GAME.world.player.dir = 1;
		}
		if(GAME.keys.D.down && GAME.keys.d.down
		&& GAME.keys.A.down && GAME.keys.a.down
		|| !GAME.keys.D.down && !GAME.keys.d.down
		&& !GAME.keys.A.down && !GAME.keys.a.down){
			GAME.world.player.dir = 0;
		}
		if(GAME.keys.S.down || GAME.keys.s.down){
			GAME.world.player.downing = true;
		}else{
			GAME.world.player.downing = false;
		}
		//shoot
		if(GAME.keys.O.down || GAME.keys.o.down){
			GAME.world.player.shooting = true;
		}else{
			GAME.world.player.shooting = false;
		}
		//reload
		if(GAME.keys.P.downed || GAME.keys.p.downed){
			GAME.world.player.gun.reload();
		}

		GAME.world.update(GAME);

		ctx.save();
		ctx.scale(c.scale, c.scale)
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, width, height)
		GAME.world.draw(ctx, GAME);
		ctx.restore();

	}

	GAME.states.pause = () => {

		if(GAME.keys[" "].downed){
			GAME.state = unpausedState;
			document.body.focus();
		}

		ctx.save();
		ctx.scale(c.scale, c.scale);
		ctx.fillStyle = "white";
		ctx.font = "40px Arial";
		ctx.fillText("Paused", 217, 150);
		ctx.font = "20px Arial";
		ctx.fillText("Press space to continue", 173, 200);
		ctx.restore();
	}

	GAME.state = GAME.states.start;

	let unpausedState;
	
	const loop = () => {
		if(!document.hasFocus()){
			if(GAME.state !== GAME.states.pause) unpausedState = GAME.state;
			GAME.state = GAME.states.pause;
		}
		GAME.state(GAME);
		GAME.keys.update();
		setTimeout(loop, 1000/60);
	}

	loop();

});
