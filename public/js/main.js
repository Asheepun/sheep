import getCanvas     			 		 from "/js/lib/canvas.js";
import getWorld      			 		 from "/js/lib/gameWorld.js";
import { wolf, squirrel, fox, eagle } 	 from "/js/enemy.js";
import vec, * as v   			 		 from "/js/lib/vector.js";
import keys		     			 		 from "/js/lib/keys.js";
import * as loaders  			 		 from "/js/lib/assets.js";
import spawnHandler 			 		 from "/js/spawnHandler.js";
import nights 							 from "/js/spawners.js";
import handlePlayerKeys 		 		 from "/js/playerKeys.js";
import clock					 		 from "/js/clock.js";
import * as hud 				 		 from "/js/hud.js";
import player, { playerArm } 			 from "/js/player.js";
import sheep 					 		 from "/js/sheep.js";
import * as obstacles 			 		 from "/js/obstacles.js";
import shadow 					 		 from "/js/shadows.js";
import bullet 					 		 from "/js/bullet.js";
import * as text 				 		 from "/js/lib/text.js";
import setupShop				 		 from "/js/shop.js";
import setupStart						 from "/js/start.js";
import moon						 		 from "/js/moon.js";

Promise.all([
	getCanvas(600, 300),
	loaders.loadJSON(
		"playerFrames",
		"wolfFrames",
		"squirrelFrames",
		"eagleFrames",
	),
	loaders.loadAudio(
		0.3,
		"shoot",
		"enemy_shoot",
		"hit",
		"kill",
		"combo1",
		"save",
		"switch",
		"no",
		"buy",
		"reload",
		"no_ammo",
		"sheep",
		"first_music",
		"set_trap",
		"eagle",
	),
	loaders.loadSprites(
		"player",
		"sheep",
		"fox",
		"wolf",
		"squirrel",
		"eagle",
		"player_corpse",
		"sheep_corpse",
		"wolf_corpse",
		"squirrel_corpse",
		"fox_corpse",
		"player_arm",
		"gun",
		"big_gun",
		"bullet",
		"big_bullet",
		"enemy_bullet",
		"platform",
		"top_platform",
		"bottom_platform",
		"ground",
		"obstacle",
		"background",
		"blood_particle",
		"ammobar",
		"ammo",
		"trapBar",
		"trap_ammo",
		"trap",
		"used_trap",
		"moon",
	),
]).then(([ { c, ctx, pointer, width, height }, JSON, audio, sprites ]) => {

	audio.setVolume();

	audio.sounds.combo1.volume = 0.4;
	audio.sounds.no_ammo.volume = 0.5;
	audio.sounds.first_music.volume = 0.7;
	
	const GAME = {
		c,
		ctx,
		pointer,
		width,
		height,
		JSON,
		audio,
		sprites,
		world: getWorld(),
		state: undefined,
		offset: vec(0, 0),
		states: {
			setupShop,
			setupStart,
		},
		progress: {},
	};

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
		"L",
		"l",
		"C",
		"c",
	);

	GAME.states.setupNight = () => {

		GAME.world.clearAll();
		
		//add platforms and ground
		GAME.world.add(obstacles.topPlatform(vec(0, 80)), "platforms", 2);
		GAME.world.add(obstacles.bottomPlatfrom(vec(200, 160)), "platforms", 2);
		GAME.world.add(obstacles.ground(vec(0, 260)), "obstacles", 2)
		
		//add player and sheep
		GAME.world.add(player(vec(285, 120)), "player", 6, true);
		GAME.world.add(playerArm(), "playerArm", 8, true);

		for(let i = 0; i < GAME.progress.sheep; i++){
			GAME.world.add(sheep(vec(240 + i*40, 240)), "sheep", 3);
		}

		//add hud
		GAME.world.add(hud.ammoBar(vec(5, 5)), "ammobar", 10, true);

		GAME.world.add(hud.trapBar(vec(0, 20)), "trapBar", 10, true);

		GAME.world.add(clock(vec(210, 17)), "clock", 10, true);

		GAME.world.add(hud.coinCounter(vec(580, 17)), "coinCounter", 10, true);
		
		GAME.world.add(hud.combo(), "combo", 10, true);

		//add shadows and moon
		for(let i = 0; i < 10; i++){
			for(let j = 0; j < 20; j++){
				let pos = vec(j*30, i*30);
				
				GAME.world.add(shadow({
					pos,
					size: vec(30, 30),
				}), "shadows", 9);
			}
		}

		GAME.world.add(moon(), "moon", 1, true);

		//add spawners
		nights[GAME.progress.night].forEach(spawner => {
			GAME.world.add(spawner, spawner.place, 0);
		});

		GAME.world.add(spawnHandler(), "spawnHandler", 0, true);

		GAME.state = GAME.states.night;
	}

	GAME.states.night = () => {

		handlePlayerKeys(GAME);

		//check time
		if(GAME.world.clock.count > 6 * 3600){
			GAME.progress.night++;
			GAME.progress.sheep = GAME.world.sheep.length;
			GAME.state = GAME.states.setupShop;
		}

		//check sheep
		if(GAME.world.sheep.length === 0){
			GAME.state = GAME.states.lost;
		}

		GAME.world.update(GAME);

		ctx.save();
		ctx.translate(GAME.offset.x, GAME.offset.y);
		ctx.scale(c.scale, c.scale)
		ctx.drawImage(GAME.sprites.background, 0, 0, GAME.width, GAME.height)
		ctx.fillStyle = "black";
		ctx.globalAlpha = 0.3;
		ctx.fillRect(0, 0, c.width, c.height),
		ctx.globalAlhpa = 1;
		GAME.world.draw(ctx, sprites);
		ctx.restore();

		//handle screenshake
		GAME.offset.x = 0;
		GAME.offset.y = 0;

	}

	GAME.states.pause = () => {

		if(GAME.keys[" "].downed){
			GAME.state = unpausedState;
			document.body.focus();
		}

		ctx.save();
		ctx.scale(c.scale, c.scale);
		text.white40("Paused", 217, 150, ctx)
		text.white20("Press space to continue", 173, 200, ctx)
		ctx.restore();
	}

	let wait = 180;

	GAME.states.lost = (GAME, ctx) => {
		wait--;
		if(wait === 0){
			wait = 180;
			GAME.state = GAME.states.setupStart;
		}

		ctx.save();
		ctx.scale(GAME.c.scale, GAME.c.scale);
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, GAME.width, GAME.height)
		text.white20("Where are all my sheep!!!", 170, 150, ctx);
		ctx.restore();
	}

	GAME.state = GAME.states.setupStart;

	let unpausedState;
	
	const loop = () => {
		if(!document.hasFocus()){
			if(GAME.state !== GAME.states.pause) unpausedState = GAME.state;
			GAME.state = GAME.states.pause;
		}
		GAME.state(GAME, ctx);
		GAME.keys.update();
		setTimeout(loop, 1000/60);
	}

	loop();

});
