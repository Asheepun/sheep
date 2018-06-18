import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";
import gun 						from "/js/gun.js";
import particle, * as particles	from "/js/particles.js";

const player = (pos) => {
	const that = traitHolder(); 

	traits.addEntityTrait({
		pos,
		size: vec(16, 20)
	})(that);

	traits.addSpriteTrait({
		img: "player",
		imgSize: that.size.copy(),
	})(that);

	traits.addMoveTrait({})(that);

	traits.addPhysicsTrait({
		gravity: 0.08,
		resistance: 0.80,
	})(that);

	traits.addColTrait({})(that);

	traits.addPlatformColTrait({})(that);

	traits.addOubTrait({
		oubArea: [0, 0, 600, 300]	
	})(that);

	traits.addGunTrait({
		gun: gun({
			pos: that.pos.copy(),
			size: vec(20, 11),
			ammoCapacity: 20,
			shotDelay: 8,
			reloadTime: 180,
			bulletSpec: {
				speed: 15,
				img: "bullet",
				size: vec(11, 7),
				spread: 0.7,
				friendly: true,
				damage: 1,
			},
			sound: "shoot",
			screenshake: true,
		})
	})(that);

	that.kills = 0;

	that.downing = false;
	that.dir = 0;
	that.controllable = true;
	that.kills = 0;

	that.handleControls = () => {
		if(that.controllable){
			that.acceleration.x = that.dir*0.9;
		}
	}

	that.jump = () => {
		if(that.onGround && that.controllable){
			that.velocity.y = -10;
			that.acceleration.y = -1.7;
		}
	}
	that.stopJump = () => {
		if(that.velocity.y < 0){
			that.velocity.y = 0;
			that.acceleration.y = 0;
		}
	}

	that.handleShooting = ({ world: { add, guns }, audio, offset }) => {
		if(that.gun.canShoot){
			if(that.velocity.x > 0) that.aiming.x = 1;
			if(that.velocity.x < 0) that.aiming.x = -1;
			if(that.shooting) that.gun.shoot(that, add, audio, offset);
		}
	}

	that.hit = false;
	that.hitVelocity = vec(0, 0);

	that.handleHit = ({ world: { add }, world }) => {
		if(that.hit){
			that.deadCounter = 120;
			that.hit = false;

			add(particle({
				pos: that.pos.copy(),
				size: vec(20, 9),
				velocity: vec(0, -2),
				img: "player_corpse",
				imgSize: vec(20, 9),
				gravity: 0.05,
			}), "particles", 4);

			for(let i = 0; i < 3; i++){
				particles.bloodEffect({
					pos: that.center.copy(),
					dir: vec(0, -1),
					world: world,
				});
			}
		}
	}

	that.deadCounter = 0;

	that.handleDead = () => {
		that.deadCounter--;

		if(that.deadCounter > 0){
			that.pos.y = -100;
			that.canMove = false;
			that.gun.canShoot = false;
		}

		if(that.deadCounter === 0){
			that.pos.y = 120;
			that.pos.x = 293;
			that.canMove = true;
			that.gun.canShoot = true;
		}
	}

	that.animate = () => {
		if(that.dir > 0) that.facing.x = 1;
		if(that.dir < 0) that.facing.x = -1;
	}

	that.addMethods("handleControls", "handleShooting", "handleHit", "handleDead", "animate");

	return that;
}

export default player;
