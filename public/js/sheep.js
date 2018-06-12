import traitHolder, * as traits 	  from "/js/lib/traits.js";
import vec, * as v 					  from "/js/lib/vector.js";
import particle, * as particleEffects from "/js/particles.js";

const sheep = (pos) => {
	const that = traitHolder(); 

	traits.addEntityTrait({
		pos,
		size: vec(20, 13)
	})(that);

	traits.addSpriteTrait({
		img: "sheep",
		imgSize: that.size.copy(),
	})(that);

	traits.addMoveTrait({})(that);

	traits.addPhysicsTrait({
		gravity: 0.003,
		resistance: 0.80,
	})(that);

	traits.addColTrait({})(that);

	traits.addOubTrait({
		oubArea: [0, 0, 600, 300],
	})(that);

	that.grabbed = false;
	that.grabbedPos = vec();

	that.handleGrabbedPos = () => {
		if(that.grabbed){
			that.canMove = false;
			that.pos = that.grabbedPos.copy();
			that.grabbed = false;
		}else{
			that.canMove = true;
		}
	}

	that.checkOub = () => {
		if(that.pos.x > 600 || that.pos.x < -20)
			that.hit = true;
	}

	that.handleHit = ({ world: { remove, add }, world, audio: { play } }) => {
		if(that.hit){
			for(let i = 0; i < 3; i++){
				particleEffects.bloodEffect({
					pos: that.center.copy(),
					dir: vec(0, -1),
					world,
				});
			}
			add(particle({
				pos: that.pos.copy(),
				size: vec(20, 7),
				velocity: vec(0, 0),
				img: "sheep_corpse",
				imgSize: vec(20, 7),
				gravity: 0.04,
			}), "particles", 4);

			play("sheep");
			play("kill");

			remove(that);
		}
	}

	that.addMethods("handleGrabbedPos", "checkOub", "handleHit");

	return that;
}

export default sheep;

