import * as text 				from "/js/lib/text.js";
import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";
import * as hud 				from "/js/hud.js";

let currentShopButton;

const setupShop = (GAME) => {
	GAME.world.clearAll();

	GAME.world.add(hud.coinCounter(vec(580, 17)), "coinCounter", 5, true);

	GAME.world.add(clickableText("$2000", vec(325, 100), (GAME) => {
		if(GAME.progress.coins < 2000 || GAME.progress.sheep >= 3){
			GAME.audio.play("no");
			return;
		}
		GAME.progress.sheep++;
		GAME.progress.coins -= 2000;
		GAME.audio.play("buy");
	}), "shopButtons", 5);

	GAME.world.add(clickableText("$1000", vec(325, 130), (GAME) => {
		if(GAME.progress.coins < 1000 || GAME.progress.traps >= 3){
			GAME.audio.play("no");
			return;
		}
		GAME.progress.traps++;
		GAME.progress.coins -= 1000;
		GAME.audio.play("buy");
	}), "shopButtons", 5);

	GAME.world.add(clickableText("$1500", vec(325, 160), (GAME) => {
		if(GAME.progress.coins < 1500){
			GAME.audio.play("no");
			return;
		}
		GAME.progress.coins -= 1500;
		localStorage.progress = JSON.stringify(GAME.progress);
		GAME.audio.play("save");
	}), "shopButtons", 5);

	GAME.world.add(clickableText("Continue", vec(255, 200), (GAME) => {
		GAME.fadeToState("setupNight");
	}), "shopButtons", 5);

	if(GAME.progress.night >= 3){
		GAME.world.clearTypes("shopButtons");

		GAME.world.add(clickableText("$2000", vec(325, 100), (GAME) => {
			if(GAME.progress.coins < 2000){
				GAME.audio.play("no");
				return;
			}
			localStorage.removeItem("progress");
			localStorage.house = "dir_hut";
			GAME.fadeToState("setupStart");
		}), "shopButtons", 5);

		GAME.world.add(clickableText("$5000", vec(325, 130), (GAME) => {
			if(GAME.progress.coins < 5000){
				GAME.audio.play("no");
				return;
			}
			localStorage.removeItem("progress");
			localStorage.house = "apartment";
			GAME.fadeToState("setupStart");
		}), "shopButtons", 5);
		
		GAME.world.add(clickableText("$8000", vec(325, 160), (GAME) => {
			if(GAME.progress.coins < 8000){
				GAME.audio.play("no");
				return;
			}
			localStorage.removeItem("progress");
			localStorage.house = "bungalow";
			GAME.fadeToState("setupStart");
		}), "shopButtons", 5);

		GAME.world.add(clickableText("$15000", vec(325, 190), (GAME) => {
			if(GAME.progress.coins < 15000){
				GAME.audio.play("no");
				return;
			}
			localStorage.removeItem("progress");
			localStorage.house = "farm";
			GAME.fadeToState("setupStart");
		}), "shopButtons", 5);

		GAME.world.add(clickableText("No House (Shame)", vec(230, 230), (GAME) => {
			localStorage.removeItem("progress");
			GAME.fadeToState("setupStart");
		}), "shopButtons", 5);
	}

	currentShopButton = 0;

	GAME.state = shop;
}

const shop = (GAME, ctx) => {

	//keys
	if(GAME.keys.w.downed || GAME.keys.W.downed){
		GAME.audio.play("switch");
		currentShopButton--;
		if(currentShopButton < 0) 
			currentShopButton = GAME.world.shopButtons.length-1;
	}
	if(GAME.keys.s.downed || GAME.keys.S.downed){
		GAME.audio.play("switch");
		currentShopButton++;
		if(currentShopButton >= GAME.world.shopButtons.length) 
			currentShopButton = 0;
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

	if(GAME.state !== shop) return;

	//draw
	ctx.save();
	ctx.scale(GAME.c.scale, GAME.c.scale);

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, GAME.width, GAME.height);

	text.white40("Shop", 250, 50, ctx);
	text.white15("Sheep: " + GAME.progress.sheep + "/3", 210, 100, ctx);
	text.white15("Traps: " + GAME.progress.traps + "/3", 210, 130, ctx);
	text.white15("Save:", 210, 160, ctx);
	text.white5("Last save", 270, 155, ctx);
	text.white5("Night " + (JSON.parse(localStorage.progress).night + 1), 270, 160, ctx);

	if(GAME.progress.night >= 3){
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, GAME.width, GAME.height);
		text.white15("Dirt Hut", 210, 100, ctx);
		text.white15("Apartment", 210, 130, ctx);
		text.white15("Bungalow", 210, 160, ctx);
		text.white15("Farm", 210, 190, ctx);
	}

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
