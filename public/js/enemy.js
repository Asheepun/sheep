import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";
import bullet					from "/js/bullet.js";

const enemy = ({ pos, size, health, color }) => {
	const that = traitHolder(); 

	traits.addEntityTrait({
		pos,
		size,
	})(that);

	traits.addSpriteTrait({
		color,	
	})(that);

	traits.addMoveTrait({})(that);

	traits.addPhysicsTrait({
		gravity: 0.08,
		resistance: 0.80,
	})(that);

	traits.addColTrait({})(that);

	traits.addOubTrait({
		oubArea: [-90, 0, 780, 260]	
	})(that);

	that.AI = () => {
		console.log("Please add an AI to me!");
	}

	that.health = health;
	that.hit = false;

	that.handleHit = ({ world: { remove } }) => {
		if(that.hit){
			that.hit = false;
			that.health--;
		}

		if(that.health <= 0){
			remove(that);
		}
	}

	that.addMethods("AI", "handleHit");

	return that;
}

export const smallWolf = (pos) => {
	const that = enemy({
		pos,
		size: vec(18, 20),
		health: 2,
		color: "grey",
	});

	that.speed = 0.2;

	that.AI = () => {
		if(that.center.x > 300)
			that.acceleration.x = -that.speed;
		else that.acceleration.x = that.speed;

		if(that.hit) that.speed += 0.3;
	}

	return that;
}

export const sniperWolf = (pos) => {
	const that = enemy({
		pos,
		size: vec(15, 14),
		health: 2,
		color: "darkgrey"
	});

	traits.addPlatformColTrait({})(that);

	let waitCounter = 120;
	let walkCounter = 0;

	that.AI = (GAME) => {
		waitCounter--;
		walkCounter--;

		if(waitCounter === 0){
			walkCounter = 60;
			if(that.center.x < 300) that.acceleration.x = 0.15;
			else that.acceleration.x = -0.15;
		}
		if(walkCounter === 0){
			waitCounter = 120;
			that.acceleration.x = 0;
			that.shoot(GAME);
		}
	}

	let bulletVel;
	let bulletPos;

	that.shoot = ({ world: { add, player } }) => {
		bulletVel = v.pipe(
			v.sub(player.center, that.center),
			v.normalize,
			x => v.mul(x, 6),
		);
		bulletPos = that.center.copy();

		const b = bullet({ 
			pos: bulletPos,
			velocity: bulletVel,
			size: vec(20, 10),
			friendly: false,
		})	
		b.color = "orange";
		add(b, "bullets", 3)
	}

	return that;
}
