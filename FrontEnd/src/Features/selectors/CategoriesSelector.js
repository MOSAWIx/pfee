

export const CategoriesSelector = {
    categories: (state) => state.root.categories.category,
    loading: (state) => state.root.categories.loading,
    error: (state) => state.root.categories.error,
}

export default CategoriesSelector;
