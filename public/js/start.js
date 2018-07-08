import * as text 						 from "/js/lib/text.js";
import traitHolder, * as traits 		 from "/js/lib/traits.js";
import vec, * as v 						 from "/js/lib/vector.js";
import * as hud 						 from "/js/hud.js";
import handleSettingsKeys, * as settings from "/js/settings.js";

let currentButton;

const setupStart = (GAME) => {
	GAME.world.clearAll();

	const startNight = (GAME) => {
		GAME.progress = JSON.parse(localStorage.progress);
		GAME.fadeToState("setupNight");
	}
	const loadSave = (GAME) => {
		startNight(GAME);
		GAME.fadeToState("setupShop");
	}

	GAME.world.add(clickableText("New Game", vec(270, 130), (GAME) => {
		localStorage.progress = JSON.stringify({
			coins: 0,
			night: 0,
			sheep: 3,
			traps: 1,
		});
		startNight(GAME)
	}), "startButtons", 2);

	currentButton = 0;

	if(localStorage.progress && JSON.parse(localStorage.progress).night > 0){
		GAME.world.add(clickableText("Load Save", vec(270, 150), loadSave), "startButtons", 2);
		currentButton = 1;
	}

	GAME.world.add(settings.volume(vec(570, 35)), "volume", 10, true);

	const houseState = traitHolder();
	
	traits.addEntityTrait({
		pos: vec(280, 50),
		size: vec(40, 40),
	})(houseState);

	traits.addSpriteTrait({
		img: "no_house",
		imgSize: vec(40, 40),
	})(houseState);

	traits.addFrameTrait({
		delay: 8,
		frames: "no_houseFrames",
	})(houseState);

	if(localStorage.house !== undefined){
		houseState.img = localStorage.house;
		houseState.frames = localStorage.house + "Frames";
	}

	GAME.world.add(houseState, "houseState", 5, true);

	GAME.state = start;
}

const start = (GAME, ctx) => {

	//button keys
	if(GAME.keys.w.downed || GAME.keys.W.downed){
		GAME.audio.play("switch");
		currentButton--;
		if(currentButton < 0) 
			currentButton = GAME.world.startButtons.length-1;
	}
	if(GAME.keys.s.downed || GAME.keys.S.downed){
		GAME.audio.play("switch");
		currentButton++;
		if(currentButton >= GAME.world.startButtons.length) 
			currentButton = 0;
	}
	if(GAME.keys[" "].downed){
		GAME.world.startButtons[currentButton].action(GAME);
	}

	GAME.world.startButtons.forEach((btn, i) => {
		if(i === currentButton)
			btn.selected = true;
		else btn.selected = false;
	});

	GAME.world.update(GAME);

	//draw
	ctx.save();
	ctx.scale(GAME.c.scale, GAME.c.scale);

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, GAME.width, GAME.height);

	text.grey15("Up: W", 17, 17, ctx);
	text.grey15("Down: S", 17, 34, ctx);
	text.grey15("Select: Space", 17, 51, ctx);
	text.grey15("VolumeUp: +", 17, 68, ctx);
	text.grey15("VolumeDown: -", 17, 85, ctx);

	GAME.world.draw(ctx, GAME.sprites);

	ctx.restore();
}

const clickableText = (value, pos, action) => {
	const that = traitHolder();
	that.value = value;
	that.action = action;
	that.selected = false;

	that.selected = false;

	traits.addEntityTrait({
		pos,
		size: vec(0, 0),
	})(that);

	that.draw = (ctx) => {
		ctx.fillStyle = "white";
		if(that.selected) ctx.fillStyle = "yellow";
		ctx.font = "15px game";
		ctx.fillText(that.value, that.pos.x, that.pos.y);
	}

	return that;
}

export default setupStart;
