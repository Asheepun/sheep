import vec, * as v 				from "/js/lib/vector.js";
import traitHolder, * as traits from "/js/lib/traits.js";
import * as text			    from "/js/lib/text.js";

export const ammoBar = (pos) => {
	const that = traitHolder({
		pos,
	});

	that.ammo;
	that.reloadCounter;
	that.ammoCapacity;

	that.checkPlayerStatus = ({ world: { player } }) => {
		that.ammo = player.gun.ammo;
		that.reloadCounter = player.gun.reloadCounter;
		that.ammoCapacity = player.gun.ammoCapacity;
	}

	that.draw = (ctx, sprites) => {
		ctx.globalAlpha = 1;
		ctx.fillStyle = "grey";
		ctx.drawImage(sprites.ammobar, 0, 0, 205, 20);

		ctx.fillStyle = "yellow";
		for(let i = 0; i < that.ammo; i++){
			ctx.drawImage(sprites.ammo, that.pos.x + i*9, that.pos.y, 7, 10)
		}

		ctx.font = "15px game"
		if(that.reloadCounter > 0){
			ctx.fillStyle = "orange";
			ctx.fillText(Math.floor((that.reloadCounter-1)/60)+1, 189, 16)
		}else{
			ctx.fillStyle = "white";
			ctx.fillText("P", 189, 16)
		}
	}

	that.addMethods("checkPlayerStatus");

	return that;
}

export const trapBar = (pos) => {
	const that = traitHolder();

	traits.addEntityTrait({
		pos,
		size: vec(50, 20),
	})(that);

	that.traps = 0;

	that.checkStatus = ({ progress }) => {
		that.traps = progress.traps;
	}

	that.draw = (ctx, sprites) => {
		ctx.drawImage(sprites.trapBar, that.pos.x, that.pos.y, that.size.x, that.size.y);
		for(let i = 0; i < that.traps; i++){ 
			ctx.drawImage(sprites.trap_ammo, that.pos.x + i*15 + 5, that.pos.y + 5, 10, 10);
		}
	}

	that.addMethods("checkStatus");

	return that;
}

export const coinCounter = (pos) => {
	const that = traitHolder();
	that.pos = pos;

	that.coins;

	that.checkStatus = ({ progress: { coins } }) => {
		that.coins = coins;
	}

	that.draw = (ctx) => {
		text.white15("$" + that.coins, that.pos.x - ("" + that.coins).length*8, that.pos.y, ctx);
	}

	that.addMethods("checkStatus");

	return that;
}

export const combo = () => {
	const that = traitHolder();

	that.pos = vec();
	that.counter = 0;
	
	that.checkStatus = ({ world: { player } }) => {
		that.pos.x = player.pos.x + 4;
		that.pos.y = player.pos.y - 5;
	}

	let countTimer = 0;
	let lastCounter = 0;

	that.count = ({ world: { player, add }, progress, audio: { play, playOffSync } }) => {
		countTimer--;
		if(that.counter > lastCounter) countTimer = 60;

		if(countTimer === 0){
			progress.coins += 10 * Math.pow(2, that.counter);

			for(let i = 0; i < that.counter; i++){
				setTimeout(() => playOffSync("combo1"), 70*i);
			}
			add(coinText(10 * Math.pow(2, that.counter), vec(player.pos.x, player.pos.y)), "text", 10);
			that.counter = 0;
		}

		lastCounter = that.counter;
	}

	that.draw = (ctx) => {
		if(that.counter > 0){
			ctx.fillStyle = "white";
			ctx.font = "15px game";
			ctx.fillText(that.counter, that.pos.x, that.pos.y);
		}
	}
	
	that.addMethods("checkStatus", "count");

	return that;
}

const coinText = (coins, pos) => {
	const that = traitHolder();

	traits.addEntityTrait({
		pos,
		size: vec(0, 0),
	})(that);

	traits.addMoveTrait({
		velocity: vec(0, -1),
	})(that);

	let counter = 25;
	that.deleteCounter = ({ world: { remove } }) => {
		counter--;
		if(counter <= 0) remove(that);
	}

	that.draw = (ctx) => {
		text.white15("$" + coins, pos.x, pos.y, ctx);
	}

	that.addMethods("deleteCounter");

	return that;
}
