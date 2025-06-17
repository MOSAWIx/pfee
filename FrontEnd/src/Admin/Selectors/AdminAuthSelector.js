

const AdminAuthSelector = {
    isAdmin: (state) => state.admin.adminAuth.isAuthenticated,
    isLoading: (state) => state.admin.adminAuth.loading,
    isError: (state) => state.admin.adminAuth.error,
    AdminToken: (state) => state.admin.adminAuth.token,
}

export default AdminAuthSelector;