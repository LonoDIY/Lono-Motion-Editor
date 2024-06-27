function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        const arrCopy = [];
        obj.forEach((item, index) => {
            arrCopy[index] = deepClone(item);
        });
        return arrCopy;
    }

    const objCopy = {};
    Object.keys(obj).forEach(key => {
        objCopy[key] = deepClone(obj[key]);
    });

    return objCopy;
}

export {
    deepClone,
}