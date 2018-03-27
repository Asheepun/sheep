const vec = (x = 0, y = 0) => {
    const that = {
        x, 
        y,
        mag: Math.sqrt(x*x + y*y),
    }; 

    //cascading mutation methods
    that.set = (x, y) => {
        if(typeof x === "number"){
            that.x = x;
            that.y = y;
            that.mag = Math.sqrt(x*x + y*y);
        }else{
            that.x = x.x;
            that.y = x.y;
            that.mag = x.mag;
        }
        return that;
    }
    that.add = (v, x) => {
        if(typeof v === "number") 
            that.set(that.x + v, that.y + x);
        else that.set(that.x + v.x, that.y + v.y);
        return that;  
    }
    that.sub = (v, x) => {
        if(typeof v === "number") 
            that.set(that.x - v, that.y - x);
        else that.set(that.x - v.x, that.y - v.y);
        return that;  
    }
    that.mul = (v) => {
        if(typeof v === "number") 
            that.set(that.x * v, that.y * v);
        else that.set(that.x * v.x, that.y * v.y);
        return that;  
    }
    that.div = (v) => {
        if(typeof v === "number") 
            that.set(that.x * v, that.y * v);
        else that.set(that.x * v.x, that.y * v.y);
        return that;  
    }
    that.reverse = () => {
        that.set(-that.x, -that.y);
        return that;
    }
    that.normalize = () => {
        if(that.mag !== 0) that.set(that.x/that.mag, that.y/that.mag);
        return that
    }
    that.abs = () => {
        that.x = Math.abs(that.x);
        that.y = Math.abs(that.y);
        return that;
    }
    that.limit = (num) => {
        if(that.x > num) that.x = num;
        if(that.y > num) that.y = num;
        return that;
    }
    //return methods
    that.copy = () => vec(that.x, that.y);

    return that;
}

export const rVec = (low, high) => vec(Math.random()*high+low, Math.random()*high+low);

export const add = (vec1, vec2) => vec(vec1.x+vec2.x, vec1.y+vec2.y); 

export const sub = (vec1, vec2) => vec(vec1.x-vec2.x, vec1.y-vec2.y); 

export const div = (v, x) => vec(v.x/x, v.y/x); 

export const mul = (v, x) => vec(v.x*x, v.y*x);

export const dub = (v) => mul(v, 2);

export const half = (v) => div(v, 2);

export const reverse = (v) => vec(-v.x, -v.y);

export const normalize = (v) => v.mag !== 0 ? div(v, v.mag) : v;

export const abs = (v) => vec(Math.abs(v.x), Math.abs(v.y));

export const floor = (v) => vec(Math.floor(v.x), Math.floor(v.y)); 

export const round = (v) => vec(Math.round(v.x), Math.round(v.y)); 

export const align = (cord, scl) => {
    if(Math.floor(cord) % scl === 0) return Math.floor(cord);
    else return align(cord-1, scl);
}

export const angle = (vec1, vec2) => -Math.atan2(vec1.x - vec2.x, vec1.y - vec2.y);

export const pipe = (x, ...funcs) => funcs.reduce((x, func) => func(x), x);

export const getDir = (vec, dist = 1) => pipe(
    vec,
    normalize,
    reverse,
    x => mul(x, dist),
);


export default vec;
