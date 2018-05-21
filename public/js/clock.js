import traitHolder, * as traits from "/js/lib/traits.js";

const clock = () => {
	const that = traitHolder();

	that.count = 0;

	that.tick = () => {
		that.count += 2;
	}

	let time;

	that.draw = (ctx) => {
		
		time = getTime(that.count);

		ctx.fillStyle = "white";
		ctx.fillText(time.minutes + ":" + time.seconds, 100, 100);
	}

	that.addMethods("tick");
	
	return that;
}

const getTime = (count, seconds = 0, minutes = 0) => {

	if(count >= 60){
		return getTime(count-60, seconds+1, minutes);
	}
	if(seconds >= 60){
		return getTime(count, seconds-60, minutes+1);
	}

	return {
		seconds,
		minutes,
	};
}

export default clock;
