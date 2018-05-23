import traitHolder, * as traits from "/js/lib/traits.js";
import * as time 				from "/js/lib/time.js";

const clock = (pos) => {
	const that = traitHolder({
		pos,
	});

	that.count = 0;

	that.tick = () => {
		that.count += 2;
	}

	that.draw = (ctx) => {

		ctx.fillStyle = "white";
		ctx.fillText(time.getClockText(time.getTime(that.count)), that.pos.x, that.pos.y);
	}

	that.addMethods("tick");
	
	return that;
}

export default clock;
