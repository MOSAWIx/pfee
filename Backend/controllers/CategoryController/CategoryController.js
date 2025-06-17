const Category = require('../../models/CategoryModel');
const validateCategory = require('./Validation/CategoryValidation');
const slugify = require('slugify')
const createError = require('../../Utils/createError');


// endsPoints here
// create category
exports.addCategory = async (req, res, next) => {
    try {
        const { error, value } = validateCategory(req.body);
        if (error) return next(createError(400, error.details[0].message));

        const { name, description, parent, active } = value;

        // Check if category name (all langs) already exists
        const nameExists = await Category.findOne({
            $or: [
                { "name.en": name.en },
                { "name.fr": name.fr },
                { "name.ar": name.ar }
            ]
        });
        if (nameExists) return next(createError(400, 'Category with this name already exists'));

        // Generate slug per language
        const slug = {
            en: slugify(name.en, { lower: true, strict: true }),
            fr: slugify(name.fr, { lower: true, strict: true }),
            ar: slugify(name.ar, { lower: true, strict: true }),
        };

        // Ensure slugs are unique
        const slugExists = await Category.findOne({
            $or: [
                { "slug.en": slug.en },
                { "slug.fr": slug.fr },
                { "slug.ar": slug.ar }
            ]
        });
        if (slugExists) return next(createError(400, 'Slug already exists'));

        // Check parent
        if (parent) {
            const parentExists = await Category.findById(parent);
            if (!parentExists) return next(createError(400, 'Parent category not found'));
        }

        // Create
        const category = new Category({
            name,
            description,
            slug,
            parent: parent || null,
            active: active !== undefined ? active : true
        });

        await category.save();
        res.status(201).json({ message: 'Category created', category });
    } catch (err) {
        next(createError(500, err.message));
    }
};

// Fetch Categories
exports.getCategories = async (req, res, next) => {
    try {
        // Fetch Categories
        const categories = await Category.find({}).sort({ createdAt: -1 });
        // Response
        res.status(200).json({
            message: 'Categories fetched successfully',
            categories
        });
    } catch (error) {
        return next(createError(500, error.message));
    }
};
// Fetch Category by ID
exports.getCategoryById = async (req, res, next) => {
    try {
        const CatgeryId = req.params.id;
        // Validate ID
        if (!CatgeryId) {
            return next(createError(400, err.message));
        }
        // Fetch Category by ID
        const category = await Category.findById(CatgeryId)
        // if category not found
        if (!category) {
            return next(createError(404, 'Category not found'));
        }
        // Response
        res.status(200).json({
            message: 'Category fetched successfully',
            category
        });
    } catch (error) {
        return next(createError(500, error.message));
    }
}
// Delete Category
exports.deleteCategory = async (req, res, next) => {
    try {
        const CatgeryId = req.params.id;
        // Validate ID
        if (!CatgeryId) {

            return next(createError(400, "Category ID is required"));
        }
        // Fetch Category by ID
        const category = await Category.findByIdAndDelete(CatgeryId)
        // if category not found
        if (!category) {
            return next(createError(404, 'Category not found'));
        }
        // Response
        res.status(200).json({
            message: 'Category deleted successfully',
            category
        });
    } catch (error) {
        const err = new Error();
        err.status = 500;
        err.message = error.message;
        return next(err);
    }
}
// Update Category
exports.updateCategory = async (req, res, next) => {
    try {
        const CatgeryId = req.params.id;
        if (!CatgeryId) return next(createError(400, 'Category ID is required'));

        const category = await Category.findById(CatgeryId);
        if (!category) return next(createError(404, 'Category not found'));
        console.log(req.body, "9all body");
        const { error, value } = validateCategory({
            name: req.body.name,
            description: req.body.description,
            parent: req.body.parent,
            active: req.body.active
        });
        if (error) return next(createError(400, error.details[0].message));

        const { name, description, parent, active } = value;

        // Generate slugs per language
        const slug = {
            en: slugify(name.en, { lower: true, strict: true }),
            fr: slugify(name.fr, { lower: true, strict: true }),
            ar: slugify(name.ar, { lower: true, strict: true }),
        };

        // Check for duplicate slugs in other categories
        const slugExists = await Category.findOne({
            _id: { $ne: CatgeryId },
            $or: [
                { "slug.en": slug.en },
                { "slug.fr": slug.fr },
                { "slug.ar": slug.ar }
            ]
        });
        if (slugExists) return next(createError(400, 'Slug already exists'));

        // Check if parent exists (if provided)
        if (parent) {
            const parentExists = await Category.findById(parent);
            if (!parentExists) return next(createError(400, 'Parent category not found'));
        }

        // Update fields
        category.name = name || category.name;
        category.description = description || category.description;
        category.slug = slug || category.slug;
        category.parent = parent || null;
        category.active = active !== undefined ? active : category.active;

        await category.save();
        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (err) {
        return next(createError(500, err.message));
    }
};
