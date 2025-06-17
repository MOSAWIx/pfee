const Joi = require("joi");
const Product = require("../../models/ProductModel");
const { processProductImage } = require("../../Utils/imageProcessor");
const productValidationSchema = require("./Validation/ProductSchemaValidation");
const ProductSchemaQuery = require("./Validation/ProductQueryValidation");
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const mongoose = require('mongoose');

// EndsPoint Of Product
// Get All Products
exports.getProducts = async (req, res, next) => {
    try {
        const { error, value } = ProductSchemaQuery.validate(req.query);
        if (error) {
            const newErr = new Error();
            newErr.statusCode = 400;
            newErr.message = error.details[0].message;
            return next(newErr);
        }

        const {
            isActive,
            page = 1,
            limit = 10,
            search,
            category,
            minPrice,
            maxPrice,
            lang = "en", // Default language if not provided
            color,
            size,
            sizeType
        } = value;

        const skip = (page - 1) * limit;
        const query = {};

        if (category && mongoose.Types.ObjectId.isValid(category)) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { [`title.${lang}`]: new RegExp(search, 'i') },
                { [`description.${lang}`]: new RegExp(search, 'i') }
            ];
        }
        if (minPrice || maxPrice) {
            query.basePrice = {};
            if (minPrice) query.basePrice.$gte = minPrice;
            if (maxPrice) query.basePrice.$lte = maxPrice;
        }
        // Only add active filter if isActive is explicitly set
        if (isActive !== undefined && isActive !== null) {
            query.active = isActive;
        }

        // Color filter
        if (color) {
            query['color'] = new RegExp(color, 'i');
        }

        // Size filter
        if (size && sizeType) {
            if (sizeType === 'shoes') {
                query['colors.tailles.value'] = size;

            } else if (sizeType === 'clothing') {
                query['colors.sizes.value'] = size;
            }
        }

        const [products, total] = await Promise.all([
            Product.find(query).populate({ path: "category" }).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Product.countDocuments(query)
        ]);

        res.json({
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            products
        });
    } catch (err) {
        const newError = new Error();
        newError.statusCode = 500;
        newError.message = err.message || "Internal Server Error";
        return next(newError);
    }
};

// Add Product

exports.addProduct = async (req, res, next) => {
    try {
        // Parse JSON fields from form data
        let parsedBody = {};

        // Parse JSON fields
        for (const key in req.body) {
            if (req.body[key] && (key === 'title' || key === 'description' || key === 'colors' || key === 'size' || key === 'taille')) {
                try {
                    parsedBody[key] = JSON.parse(req.body[key]);
                } catch (err) {
                    // If parsing fails, keep the original value
                    parsedBody[key] = req.body[key];
                }
            } else {
                parsedBody[key] = req.body[key];
            }
        }

        // Check for category


        // Ensure numeric values are parsed correctly
        if (parsedBody.basePrice) parsedBody.basePrice = Number(parsedBody.basePrice);
        if (parsedBody.priceFor2) parsedBody.priceFor2 = Number(parsedBody.priceFor2);
        if (parsedBody.priceFor3) parsedBody.priceFor3 = Number(parsedBody.priceFor3);
        if (parsedBody.discount) parsedBody.discount = Number(parsedBody.discount);
        if (parsedBody.active) parsedBody.active = parsedBody.active === 'true';
        if (parsedBody.googleSheetId) parsedBody.googleSheetId = parsedBody.googleSheetId.trim();

        // Validate the parsed body
        const { error, value } = productValidationSchema.validate(parsedBody);
        if (error) {
            const err = new Error();
            err.statusCode = 400;
            err.message = error.details[0].message;
            return next(err);
        }

        const { title, description, basePrice, priceFor2, priceFor3, discount, category, colors, active } = value;

        // Group files by color name
        const colorFiles = {};
        if (req.files) {
            req.files.forEach(file => {
                const fieldName = file.fieldname;
                if (fieldName.startsWith('color_')) {
                    const colorName = fieldName.replace('color_', '');
                    if (!colorFiles[colorName]) {
                        colorFiles[colorName] = [];
                    }
                    colorFiles[colorName].push(file);
                }
            });
        }

        // Process images for each color
        const processedColors = await Promise.all(colors.map(async (color) => {
            const colorName = color.name.en;

            if (!colorFiles[colorName] || !colorFiles[colorName].length) {
                throw new Error(`Images for color ${colorName} are required`);
            }

            const colorImages = await Promise.all(
                colorFiles[colorName].map(image =>
                    processProductImage(
                        image.buffer,
                        image.originalname,
                        colorName
                    )
                )
            );

            return {
                name: {
                    en: color.name.en,
                    fr: color.name.fr,
                    ar: color.name.ar
                },
                colorHex: color.colorHex,
                sizes: color.sizes || [],
                tailles: color.tailles || [],
                images: colorImages,

            };
        }));

        const product = new Product({
            title: {
                en: title.en,
                fr: title.fr,
                ar: title.ar
            },
            description: {
                en: description?.en || '',
                fr: description?.fr || '',
                ar: description?.ar || ''
            },
            basePrice,
            discount,
            category,
            googleSheetId: parsedBody.googleSheetId || '',
            colors: processedColors,
            priceFor2: priceFor2 || 0,
            priceFor3: priceFor3 || 0,
            active: active !== undefined ? active : true
        });

        await product.save();
        
        // Fetch the saved product with populated category
        const savedProduct = await Product.findById(product._id).populate('category');

        res.status(201).json({
            message: "Product Created Successfully",
            product: savedProduct
        });
    } catch (error) {
        const newError = new Error();
        newError.statusCode = 500;
        newError.message = error.message || "Internal Server Error";
        return next(newError);
    }
};

// Delete Product
exports.deleteProduct = async (req, res, next) => {
    console.log("deleteProduct", req.params);
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            const newErr = new Error("Invalid Product Id");
            newErr.statusCode = 400;
            return next(newErr);
        }

        const product = await Product.findById(id);
        if (!product) {
            const newErr = new Error("Product Not Found");
            newErr.statusCode = 404;
            return next(newErr);
        }

        // Delete associated images
        for (const color of product.colors) {
            for (const image of color.images) {
                try {
                    const webpPath = path.join(__dirname, '..', '..', 'uploads', 'products', image.webpPath.split('/uploads/products/')[1]);
                    const thumbnailPath = path.join(__dirname, '..', '..', 'uploads', 'products', image.thumbnailPath.split('/uploads/products/')[1]);

                    await fsPromises.unlink(webpPath);
                    await fsPromises.unlink(thumbnailPath);
                } catch (err) {
                    console.error(`Failed to delete image: ${err.message}`);
                }
            }
        }

        await Product.findByIdAndDelete(id);

        res.status(200).json({
            message: "Product Deleted Successfully",
            product
        });
    } catch (error) {
        const newError = new Error();
        newError.statusCode = 500;
        newError.message = "Internal Server Error";
        return next(newError);
    }
};
// get Product By Id
exports.getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            const newErr = new Error("Invalid Product Id");
            newErr.statusCode = 400;
            return next(newErr);
        }

        const product = await Product.findById(id).populate('category');
        console.log("product", product);
        if (!product) {
            const newErr = new Error("Product Not Found");
            newErr.statusCode = 404;
            return next(newErr);
        }
        console.log(product);
        res.status(200).json({
            message: "Product Found Successfully",
            product
        });
    } catch (error) {
        const newError = new Error();
        newError.statusCode = 500;
        newError.message = error.message || "Internal Server Error";
        return next(newError);
    }
}
// Update Product

exports.updateProduct = async (req, res, next) => {
    console.log("updateProduct", req.body);
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            const error = new Error("Invalid Product ID");
            error.statusCode = 400;
            return next(error);
        }

        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            const error = new Error("Product not found");
            error.statusCode = 404;
            return next(error);
        }

        // Parse fields
        let parsedBody = {};
        for (const key in req.body) {
            if (['title', 'description', 'colors'].includes(key)) {
                try {
                    parsedBody[key] = JSON.parse(req.body[key]);
                } catch {
                    parsedBody[key] = req.body[key];
                }
            } else {
                parsedBody[key] = req.body[key];
            }
        }

        console.log("gggggg", parsedBody["colors"])

        // Coerce types
        if (parsedBody.basePrice) parsedBody.basePrice = Number(parsedBody.basePrice);
        if (parsedBody.discount) parsedBody.discount = Number(parsedBody.discount);
        if (parsedBody.priceFor2) parsedBody.priceFor2 = Number(parsedBody.priceFor2);
        if (parsedBody.priceFor3) parsedBody.priceFor3 = Number(parsedBody.priceFor3);
        if (parsedBody.active) parsedBody.active = parsedBody.active === 'true';
        if (parsedBody.googleSheetId) parsedBody.googleSheetId = parsedBody.googleSheetId.trim();

        // Validate
        const { error: validationError, value } = productValidationSchema.validate(parsedBody);
        if (validationError) {
            const err = new Error(validationError.details[0].message);
            err.statusCode = 400;
            return next(err);
        }

        const { title, description, basePrice, priceFor2, priceFor3, discount, category, colors, active, googleSheetId } = value;

        // Group uploaded files by color index
        console.log("habib 9awa", colors)
        const colorFiles = {};
        if (req.files) {
            req.files.forEach(file => {
                const matches = file.fieldname.match(/^color_(\d+)_(\d+)$/);
                if (matches) {
                    const colorIndex = matches[1];
                    if (!colorFiles[colorIndex]) colorFiles[colorIndex] = [];
                    colorFiles[colorIndex].push(file);
                }
            });
        }

        // Process colors with their images
        const processedColors = await Promise.all(colors.map(async (color, colorIndex) => {
            console.log("color mohda", color)
            // Preserve existing images exactly as they are
            let finalImages = Array.isArray(color.images) ? color.images : [];
            console.log("finalImages", finalImages);

            // Add new images if any
            if (colorFiles[colorIndex]) {
                const newImages = await Promise.all(
                    colorFiles[colorIndex].map(file =>
                        processProductImage(
                            file.buffer,
                            file.originalname,
                            color.name.en
                        )
                    )
                );
                finalImages = [...finalImages, ...newImages];
                console.log("newImages", newImages);
            }

            return {
                name: color.name,
                colorHex: color.colorHex,
                images: finalImages,
                sizes: color.sizes || [],
                tailles: color.tailles || [],



            };
        }));

        // Clean up old images that are no longer present (compare using public_id)
        const oldColorImages = existingProduct.colors.flatMap(c => c.images);
        const newColorImages = processedColors.flatMap(c => c.images);

        // Delete images that are not in the new colors array
        for (const oldImg of oldColorImages) {
            // Check if this old image's public_id exists in the new images array
            const stillExists = newColorImages.some(newImg => {
                // If the new image has a public_id, compare it
                // This handles existing images that were kept
                if (newImg.public_id) {
                    return newImg.public_id === oldImg.public_id;
                }
                // For newly uploaded images (which won't have public_id)
                // Compare the paths to avoid deleting images that were just uploaded
                return newImg.webpPath === oldImg.webpPath;
            });

            // If the image is not found in the new array, delete it
            if (!stillExists) {
                try {
                    const webpPath = path.join(__dirname, '..', '..', 'uploads', 'products', oldImg.webpPath.split('/uploads/products/')[1]);
                    const thumbnailPath = path.join(__dirname, '..', '..', 'uploads', 'products', oldImg.thumbnailPath.split('/uploads/products/')[1]);

                    // Check if files exist before attempting to delete
                    if (fs.existsSync(webpPath)) {
                        await fsPromises.unlink(webpPath);
                    }
                    if (fs.existsSync(thumbnailPath)) {
                        await fsPromises.unlink(thumbnailPath);
                    }
                } catch (err) {
                    console.warn(`Failed to delete image file: ${err.message}`);
                }
            }
        }

        // Update product
        existingProduct.title = title;
        existingProduct.description = description;
        existingProduct.basePrice = basePrice;
        existingProduct.priceFor2 = priceFor2 || 0;
        existingProduct.priceFor3 = priceFor3 || 0;
        existingProduct.googleSheetId = googleSheetId || '';
        existingProduct.discount = discount;
        existingProduct.category = category;
        existingProduct.colors = processedColors;
        existingProduct.active = active;

        await existingProduct.save();

        // Fetch the updated product with populated category
        const updatedProduct = await Product.findById(existingProduct._id).populate('category');
        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        const newError = new Error(error.message || "Internal Server Error");
        newError.statusCode = 500;
        return next(newError);
    }
};
// get Similar Products
exports.getSimilarProducts = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            const newErr = new Error("Invalid Product Id");
            newErr.statusCode = 400;
            return next(newErr);
        }

        const product = await Product.findById(id);
        if (!product) {
            const newErr = new Error("Product Not Found");
            newErr.statusCode = 404;
            return next(newErr);
        }

        const similarProducts = await Product.find({
            category: product.category,
            _id: { $ne: id } // Exclude the current product
        }).populate('category').limit(10).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Similar Products Found Successfully",
            products: similarProducts
        });
    } catch (error) {
        const newError = new Error(error.message || "Internal Server Error");
        newError.statusCode = 500;
        return next(newError);
    }
};
// Get Collection
exports.getCollection = async (req, res, next) => {
    try {
        const NewArrival = await Product.find({ active: true }).populate('category').limit(10).sort({ createdAt: -1 });
        const BestSelling = await Product.find({ active: true }).populate('category').limit(10).sort({ createdAt: 1 });

        res.status(200).json({
            message: "Collections fetched successfully",
            collections: {
                newArrivals: NewArrival,
                bestSelling: BestSelling
            }
        });
        
    } catch (error) {
        const newError = new Error(error.message || "Internal Server Error");
        newError.statusCode = 500;
        return next(newError);
    }
}



