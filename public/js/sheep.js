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

	that.addMethods("handleGrabbedPos");

	return that;
}

export default sheep;

