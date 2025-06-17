const sharp = require("sharp");
const { encode } = require("blurhash");

const generateBlurHash = async (buffer) => {
    const image = await sharp(buffer)
        .raw()
        .ensureAlpha()
        .resize(32, 32, { fit: "inside" })
        .toBuffer({ resolveWithObject: true });

    const { data, info } = image;

    const hash = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 3);
    return hash;
};


module.exports = generateBlurHash;
