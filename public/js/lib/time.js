export const getTime = (count, seconds = 0, minutes = 0) => {

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

export const getClockText = ({ seconds, minutes }) => {
	let text = "";

	if(minutes < 10)
		text += "0";
	text += minutes;

	text += ":";

	if(seconds < 10)
		text += "0";

	text += seconds;

	return text;
}
