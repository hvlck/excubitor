/**
 * Makes the given obj immutable, preventing property modification or addition.
 * @param obj The object to make immutable.
 * @returns Returns a new object matching the original, which cannot be assigned to or extended.
 */
export const imm = <T extends object>(obj: T): T => {
    const t = Object.assign({}, obj);
    Object.freeze(t);

    return new Proxy(t, {
        get: (target, prop, receiver) => returnValue(target, prop, receiver),
        set: function () {
            return false;
        },
    });
};

/**
 * Helper function for proxies.
 */
function returnValue(target: any, prop: string | symbol, receiver: any) {
    return Reflect.get(target, prop, receiver);
}

/**
 * **W**rite-**O**nly-**O**nce. When you assign to a property for the first time, that property cannot be modified again.
 * Once all properties are assigned to, then the object will be frozen completely.
 * @param obj The object to initialize with. Note that each key needs to have a `null` value, but can be assigned to other values
 * later,
 * @returns Returns a new object which is the same as the old object.
 */
export const woo = <T extends object>(obj: T): T => {
    const hasBeenSet = {};
    Object.keys(obj).forEach(i => (hasBeenSet[i] = false));

    const t = Object.assign({}, obj);
    Object.preventExtensions(t);

    return new Proxy(t, {
        get: (target, prop, receiver) => returnValue(target, prop, receiver),
        set: function (target, prop, value) {
            if (hasBeenSet[prop] === false) {
                target[prop] = value;
                hasBeenSet[prop] = true;

                if (Object.values(hasBeenSet).every(i => i == true)) {
                    Object.freeze(t);
                }

                return true;
            }

            return false;
        },
    });
};
