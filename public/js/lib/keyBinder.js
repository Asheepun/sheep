const keyBinder = () => {
    const that = {
        bindings: [],
    };

    that.bind = ({ name, keys = [], down = () => {}, up = () => {} }) => {
        //make binding object
        const binding = {
            name,
            keys: [],
            up,
            down,
        }
        keys.forEach(key => binding.keys.push({
            name: key,
            down: false,
        }));
        that.bindings.push(binding);
    }

    that.remove = (name) => {
        that.bindings.forEach(binding => {
            if(binding.name === name)
                that.bindings.splice(that.bindings.indexOf(binding), 1);
        });
    }

    document.addEventListener("keydown", e => {
        that.bindings.forEach(binding => binding.keys.forEach(key => {
            if(e.key === key.name && !key.down){
                key.down = true;
                binding.down();
            }
        }));
    });
    document.addEventListener("keyup", e => {
        that.bindings.forEach(binding => binding.keys.forEach(key => {
            if(e.key === key.name && key.down){
                key.down = false;
                binding.up();
            }
        }));
    });

    return that;
}

export default keyBinder;