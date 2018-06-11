import * as text 				from "/js/lib/text.js";
import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";
import * as hud 				from "/js/hud.js";

let currentShopButton;;

const setupShop = (GAME) => {
	GAME.progress.sheep = GAME.world.sheep.length;

	GAME.world.clearAll();

	GAME.world.add(hud.coinCounter(vec(580, 17)), "coinCounter", 5, true);

	GAME.world.add(clickableText("$2000", vec(325, 100), (GAME) => {
		if(GAME.progress.coins >= 2000 && GAME.progress.sheep < 3){
			GAME.progress.sheep++;
			GAME.progress.coins -= 2000;
			GAME.audio.play("buy");
		}else GAME.audio.play("no");
	}), "shopButtons", 5);

	GAME.world.add(clickableText("Continue", vec(255, 200), (GAME) => {
		GAME.state = GAME.states.setupNight;

	}), "shopButtons", 5);

	currentShopButton = 0;


	GAME.state = shop;
}

const shop = (GAME, ctx) => {

	//keys
	if(GAME.keys.w.downed || GAME.keys.W.downed){
		GAME.audio.play("switch");
		currentShopButton--;
		if(currentShopButton < 0) currentShopButton = GAME.world.shopButtons.length-1;
	}
	if(GAME.keys.s.downed || GAME.keys.S.downed){
		GAME.audio.play("switch");
		currentShopButton++;
		if(currentShopButton >= GAME.world.shopButtons.length) currentShopButton = 0;
	}
	if(GAME.keys[" "].downed){
		GAME.world.shopButtons[currentShopButton].action(GAME);
	}

	GAME.world.shopButtons.forEach((btn, i) => {
		if(i === currentShopButton)
			btn.selected = true;
		else btn.selected = false;
	});

	GAME.world.update(GAME);

	//draw
	ctx.save();
	ctx.scale(GAME.c.scale, GAME.c.scale);

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, GAME.width, GAME.height);

	text.white40("Shop", 250, 50, ctx);
	text.white15("Sheep: " + GAME.progress.sheep + "/3", 210, 100, ctx);

	text.grey15("Up: W", 17, 17, ctx);
	text.grey15("Down: S", 17, 34, ctx);
	text.grey15("Select: Space", 17, 51, ctx);

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

export default setupShop;
