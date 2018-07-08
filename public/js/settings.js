import * as text 				from "/js/lib/text.js";
import traitHolder, * as traits from "/js/lib/traits.js";
import vec, * as v				from "/js/lib/vector.js";

let wait = 60;

const handleSettingsKeys = ({ keys, audio, audio: { volume, setVolume } }) => {
	if(keys["-"].down || keys["+"].down) wait = 60;
	if(keys["-"].downed && volume > 0){
		audio.volume -= 10;
		audio.setVolume();
	}
	if(keys["+"].downed && volume < 100){
		audio.volume += 10;
		audio.setVolume();
	}
}

export const volume = (pos) => {
	const that = traitHolder();

	traits.addEntityTrait({
		pos,
		size: vec(0, 0),
	})(that);

	that.volume = 100;

	that.checkStatus = ({ audio: { volume } }) => {
		wait--;
		that.volume = volume;
	}

	that.draw = (ctx, sprites) => {
		if(wait <= 0) return;
		ctx.drawImage(sprites.volume, that.pos.x-11, that.pos.y-10, 10, 10);
		text.grey15(that.volume, that.pos.x, that.pos.y, ctx);
	}

	that.addMethods("checkStatus");

	return that;
}

export default handleSettingsKeys;
