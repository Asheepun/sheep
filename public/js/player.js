import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";
import bullet 					from "/js/bullet.js";

const player = (pos) => {
	const that = traitHolder(); 

	traits.addEntityTrait({
		pos,
		size: vec(15, 17)
	})(that);

	traits.addSpriteTrait({
		color: "white"	
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

	that.downing = false;

	that.dir = 0;

	that.handleControls = () => {
		that.acceleration.x = that.dir*0.9;
	}

	that.jump = () => {
		if(that.onGround){
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

	that.aiming = 1;
	that.shooting = false;
	that.reloadTime = 0;
	let bulletPos;

	that.handleShoot = ({ world: { add }, audio: { play } }) => {
		if(that.velocity.x > 0) that.aiming = 1;
		if(that.velocity.x < 0) that.aiming = -1;
			
		that.reloadTime--;

		if(that.shooting && that.reloadTime <= 0){
			play("shoot");
			if(that.aiming > 0) bulletPos = vec(that.center.x + 5, that.pos.y + 2);
			else bulletPos = vec(that.center.x -25, that.pos.y + 2);
			add(bullet({
				pos: bulletPos,
				velocity: vec(that.aiming*15, Math.random()-0.5),
				size: vec(20, 11),
				friendly: true,
			}), "bullets", 3);
			that.reloadTime = 15;
		}
	}

	that.addMethods("handleControls", "handleShoot");

	return that;
}

export default player;
