import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";
import gun 						from "/js/gun.js";
import { checkSetCol } 			from "/js/lib/colission.js";

const enemy = ({ pos, size, health, color, img, imgSize }) => {
	const that = traitHolder(); 

	traits.addEntityTrait({
		pos,
		size,
	})(that);

	traits.addSpriteTrait({
		color,
		img,
		imgSize,
	})(that);

	traits.addMoveTrait({})(that);

	traits.addPhysicsTrait({
		gravity: 0.08,
		resistance: 0.80,
	})(that);

	traits.addColTrait({})(that);

	traits.addCheckColTrait({
		singles: ["player"],
	})(that);

	traits.addOubTrait({
		oubArea: [-90, 0, 780, 260]	
	})(that);

	that.AI = () => {
		console.log("Please add an AI to me!");
	}

	that.health = health;
	that.hit = false;

	that.handleHit = (GAME) => {
		if(that.hit){
			that.hit = false;
			that.health--;
			that.velocity.add(v.pipe(
				that.hitVelocity,
				v.normalize,
				x => v.mul(x, 5),
			));

			if(that.health > 0) GAME.audio.play("hit");
		}

		if(that.health <= 0){
			that.die(GAME);
			GAME.audio.play("kill");
		}
	}

	that.die = ({ world: { remove, player } }) => {
		player.kills++;
		remove(that);
	}

	that.playerCol = (player) => {
		player.hit = true;
		player.hitFromX = that.velocity.x;
	}

	that.addMethods("AI", "handleHit");

	return that;
}

export const wolf = (pos) => {
	const that = enemy({
		pos,
		size: vec(18, 20),
		health: 2,
		img: "wolf",
		imgSize: vec(18, 20),
	});

	traits.addCheckColTrait({
		singles: ["player"],
	})(that);

	that.playerCol = (player) => {
		player.hit = true;
		player.hitVelocity = that.velocity.copy();
	}

	that.speed = 0.2;
	that.dir = 0;

	that.AI = () => {
		that.acceleration.x = that.dir*that.speed;

		if(that.hit) that.speed += 0.3;
	}

	let sheepCol = false;
	that.grabbing;

	that.grabSheep = ({ world: { sheep } }) => {
		sheepCol = checkSetCol(that, sheep);

		if(sheepCol && !sheepCol.grabbed && !that.grabbing){
			that.grabbing = sheepCol;
			that.dir *= -1;
		}

		if(that.grabbing){
			that.grabbing.grabbed = true;
			that.grabbing.grabbedPos.x = that.pos.x;
			that.grabbing.grabbedPos.y = that.pos.y
		}
	}

	that.animate = () => {
		if(that.dir > 0) that.facing.x = 1;
		if(that.dir < 0) that.facing.x = -1;
	}

	that.addMethods("grabSheep", "animate");

	return that;
}

export const squirrel = (pos) => {
	const that = enemy({
		pos,
		size: vec(15, 20),
		health: 2,
		img: "squirrel",
		imgSize: vec(15, 20),
	});

	traits.addPlatformColTrait({})(that);

	traits.addGunTrait({
		gun: gun({
			pos: that.pos.copy(),
			size: vec(20, 10),
			shotDelay: 1,
			reloadTime: 1,
			ammoCapacity: 1,
			sound: "enemy_shoot",
			bulletSpec: {
				speed: 6,
				spread: 2,
				img: "bullet",
				size: vec(20, 10),
			}}), 
	})(that);

	that.dir = 0;
	let waitCounter = 120 + Math.floor(Math.random()*60);
	let walkCounter = 0;

	that.AI = ({ world: { add, player }, audio }) => {
		waitCounter--;
		walkCounter--;

		if(waitCounter === 0){
			walkCounter = 30 + Math.floor(Math.random()*60);
			that.acceleration.x = that.dir * 0.15;
		}
		if(walkCounter === 0){
			waitCounter = 120;
			that.acceleration.x = 0;
			that.gun.shoot(that, add, audio);
		}
		that.aiming = v.pipe(
			v.sub(that.gun.center, player.center),
			v.normalize,
			v.reverse,
		);
	}

	that.die = ({ world: { remove, player } }) => {
		player.kills++;
		remove(that);
		remove(that.gun);
	}

	that.animate = () => {
		if(that.dir > 0) that.facing.x = 1;
		if(that.dir < 0) that.facing.x = -1;
	}

	that.addMethods("animate");

	return that;
}
