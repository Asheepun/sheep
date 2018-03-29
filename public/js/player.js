import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";
import gun 						from "/js/gun.js";

const player = (pos) => {
	const that = traitHolder(); 

	traits.addEntityTrait({
		pos,
		size: vec(15, 20)
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

	traits.addGunTrait({
		gun: gun({
			pos: that.pos.copy(),
			size: vec(20, 11),
			ammoCapacity: 20,
			shotDelay: 15,
			reloadTime: 180,
			bulletSpec: {
				speed: 15,
				color: "yellow",
				size: vec(20, 11),
				spread: 0.3,
				friendly: true,
			}
		})
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

	that.handleShooting = ({ world: { add, guns } }) => {
		if(that.velocity.x > 0) that.aiming.x = 1;
		if(that.velocity.x < 0) that.aiming.x = -1;
		if(that.shooting) that.gun.shoot(that, add);
	}

	that.addMethods("handleControls", "handleShooting");

	return that;
}

export default player;
