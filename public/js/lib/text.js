export const defaultText = ({ text, color, font, fontSize, x, y, ctx }) => {
	ctx.fillStyle = color;
	ctx.font = fontSize + "px " + font;
	ctx.fillText(text, x, y);
}

export const white = (text, x, y, fontSize, ctx) => defaultText({
	text,
	x,
	y,
	fontSize,
	ctx,
	color: "white",
	font: "game",
});

export const white15 = (text, x, y, ctx) => white(text, x, y, 15, ctx);

export const white20 = (text, x, y, ctx) => white(text, x, y, 20, ctx);

export const white40 = (text, x, y, ctx) => white(text, x, y, 40, ctx);