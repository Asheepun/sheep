import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v 				from "/js/lib/vector.js";

const sheep = (pos) => {
	const that = traitHolder(); 

	traits.addEntityTrait({
		pos,
		size: vec(20, 17)
	})(that);

	traits.addSpriteTrait({
		color: "white"	
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

	that.handleHit = ({ world: { remove } }) => {
		if(that.hit){
			console.log("bäääh!");
			remove(that);
		}
	}

	that.addMethods("handleGrabbedPos", "checkOub", "handleHit");

	return that;
}

export default sheep;

