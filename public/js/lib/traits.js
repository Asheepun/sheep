import vec, * as v                         						from "/js/lib/vector.js";
import { checkCol, checkSetCol, checkOub, checkPlatformSetCol } from "/js/lib/colission.js";

const traitHolder = (startSpecs = {}) => {
    const that = startSpecs;
    that.methods = [];

    that.update = (GAME) => {
        that.methods.forEach(method => {
            that[method](GAME);
        });
    }

    that.addMethods = (...methods) => {
        methods.forEach(method => that.methods.push(method));
    }

    that.removeMethods = (...methods) => {
        methods.forEach(method => that.methods.splice(that.methods.indexOf(method), 1));
    }

    return that;
}

export default traitHolder;

export const addOubTrait = ({ oubArea = [0, 0, 900, 600], bounce = false }) => (that) => {
    that.oubArea = oubArea;

    that.handleOubX = () => {
        if(that.velocity.x > 0)
            that.pos.x = oubArea[0] + oubArea[2] - that.size.x;
        else
            that.pos.x = oubArea[0];
        if(bounce) that.velocity.x *= -1;
    }
    that.handleOubY = () => {
        if(that.velocity.y > 0){
            that.onGround = true;
            that.pos.y = oubArea[1] + oubArea[3] - that.size.y;
        }else
            that.pos.y = oubArea[1];
        if(bounce) that.velocity.y *= -1;
    }
    that.checkOub = () => checkOub(that, that.oubArea);
}

export const addPlatformColTrait = ({}) => (that) => {
	that.handlePlatformCol = (platform) => {
		if(that.velocity.y > 0 && !that.downing){
			that.onGround = true;
			that.pos.y = platform.pos.y - that.size.y;
			that.velocity.y = 0;
			that.acceleration.y = 0;
		}
	}
}

export const addColTrait = ({ bounce = false, }) => (that) => {
	that.handleColX = (obstacle) => {	
		if(that.velocity.x > 0){
			that.pos.x = obstacle.pos.x - that.size.x;
			that.onRightWall = true;
		}
		else{
			that.pos.x = obstacle.pos.x + obstacle.size.x;
			that.onLeftWall = true;
		}
		if(bounce) that.velocity.x *= -1;
		else {
			that.velocity.x = 0;
			if(that.acceleration) that.acceleration.x = 0;
		}
    }
    that.handleColY = (obstacle) => {
		if(that.velocity.y > 0){
			that.onGround = true;
			that.pos.y = obstacle.pos.y - that.size.y;
			if(!bounce){	
				that.velocity.y = 0;
				if(that.acceleration) that.acceleration.y = 0;
			}
		}else
			that.pos.y = obstacle.pos.y + obstacle.size.y;
		if(bounce) that.velocity.y *= -1;
    }
}

export const addCheckColTrait = ({ singles = [], sets = [] }) => (that) => {
    let setCol = false;
	that.colSets = sets;
	that.colSingles = singles;
    that.checkCol = (GAME) => {
        that.colSingles.forEach(single => {
            if(GAME.world[single] 
			&& checkCol(that, GAME.world[single]) 
			&& that[`${single}Col`]){
                that[`${single}Col`](GAME.world[single], GAME);
            }
        });
        that.colSets.forEach(set => {
            if(GAME.world[set]) setCol = checkSetCol(that, GAME.world[set]);
            if(setCol && that[`${set}Col`]){
                that[`${set}Col`](setCol, GAME);
            }
        });
    }

    that.addMethods("checkCol");
}

export const addEntityTrait = ({ pos, size }) => (that) => {
    that.pos = pos;
    that.size = size;

    that.fixCenter = () => {
        that.center = v.add(that.pos, v.half(that.size));
    }

    that.fixCenter();

    that.addMethods("fixCenter");
}

export const addMoveTrait = ({ velocity = vec(0, 0), canMove = true, obstacleTypes = ["obstacles"] }) => (that) => {
	that.velocity = velocity;
    that.canMove = canMove;
    that.onGround = false;
    that.onLeftWall = false;
    that.onRightWall = false;
    let oub = false;
    let col = false;
	let platCol = false;

    that.move = (GAME) => {

        col = false;
        oub = false;

        that.pos.x += that.velocity.x;
        if(that.handleOubX) oub = that.checkOub();
        if(oub) that.handleOubX(GAME);
        if(that.handleColX){
            obstacleTypes.forEach(ot => {
                if(!col) col = checkSetCol(that, GAME.world[ot]);
            });
            if(col) that.handleColX(col, GAME);
            else{
                that.onLeftWall = false;
                that.onRightWall = false;
            }
        }

        col = false;
        oub = false;
		platCol = false;

        that.pos.y += that.velocity.y;
        if(that.handleOubY) oub = that.checkOub();
        if(oub) that.handleOubY(GAME);
        if(that.handleColY){
            obstacleTypes.forEach(ot => {
                if(!col) col = checkSetCol(that, GAME.world[ot]);
            });
            if(col) that.handleColY(col, GAME);

        }
		if(that.handlePlatformCol){
			platCol = checkPlatformSetCol(that, GAME.world.platforms);
			if(platCol) that.handlePlatformCol(platCol, GAME);
		}
		if(!oub && !col && !platCol) that.onGround = false;

        that.fixCenter();
    }

    that.handleMove = (GAME) => {
        if(that.canMove) that.move(GAME);
    }

    that.addMethods("handleMove");
}

export const addPhysicsTrait = ({ acceleration = vec(0, 0), resistance = 1, gravity = 0 }) => (that) =>  {
	that.acceleration = acceleration;
	that.resistance = resistance;
	that.gravity = gravity;
	
	that.handlePhysics = () => {
		if(that.canMove){
			that.acceleration.y += that.gravity;
			that.velocity.add(that.acceleration);
			that.velocity.mul(that.resistance);
		}
	}
	
	that.addMethods("handlePhysics");
}

export const addSpriteTrait = ({ color, img, alpha = 1, rotation = 0, visible = true, imgPos = vec(0, 0), imgSize }) => (that) => {
    that.color = color;
    that.img = img;
    that.alpha = alpha;
    that.rotation = rotation;
    that.visible = visible;
    that.imgPos = imgPos;
    that.imgSize = imgSize;

    that.draw = (ctx, sprites) => {
        if(that.visible){
            ctx.save();
            ctx.translate(that.center.x, that.center.y);
            ctx.rotate(that.rotation);
            ctx.globalAlpha = that.alpha;
            ctx.fillStyle = that.color;
            if(color)ctx.fillRect(-that.size.x/2, -that.size.y/2, that.size.x, that.size.y);
            if(img)ctx.drawImage(
                sprites[that.img],
                that.imgPos.x, that.imgPos.y, that.imgSize.x, that.imgSize.y,
                -that.size.x/2, -that.size.y/2, that.size.x, that.size.y
            );
            ctx.globalApha = 1;
            ctx.restore();
        }
    }
}

export const addAnimationTrait = ({ frames, delay }) => (that) => {

    that.frameDelay = delay;
    that.state = "moving";
    that.facing = "right";
    that.frames = frames;

    let counter = 0;

    that.animate = ({ JSON }) => {
		console.log(that.velocity.x)
        counter++;

        if((counter + 1) / that.frameDelay > JSON[that.frames][that.state][that.facing].length) counter = 0;

        if(counter % that.frameDelay === 0){
            that.imgPos.x = JSON[that.frames][that.state][that.facing][counter/that.frameDelay][0];
            that.imgPos.y = JSON[that.frames][that.state][that.facing][counter/that.frameDelay][1];
            that.imgSize.x = JSON[that.frames][that.state][that.facing][counter/that.frameDelay][2];
            that.imgSize.y = JSON[that.frames][that.state][that.facing][counter/that.frameDelay][3];
        }
    }

    that.handleState = () => {
        if(that.velocity.x > 0 && that.canMove) that.facing = "right";
        if(that.velocity.x < 0 && that.canMove) that.facing = "left";
        if((that.velocity.x !== 0 || that.velocity.y !== 0) && that.canMove) that.state = "moving";
        else that.state = "still";
    }

    that.addMethods("handleState", "animate");
}

export const addGunTrait = ({ gun, aiming = vec(0, 0) }) => (that) => {
	that.gun = gun;
	that.aiming = aiming;

	//add the gun to the world so that it can be drawn
	let added = false;
	that.addGunToWorld = ({ world: { guns, add } }) => {
		if(!added){
			added = true;
			add(that.gun, "guns", 6);
		}
	}

	that.handleGunPos = () => {
		that.gun.pos = v.pipe(
			that.center,
			x => v.add(x, vec(-that.gun.size.x/2, -that.size.x/2 + 4)),
			x => v.add(x, v.mul(that.aiming, that.size.x/2))
		);
		that.gun.rotation = v.angle(vec(0, 0), that.aiming) - 4.7;
	}

	that.addMethods("addGunToWorld", "handleGunPos");
}

