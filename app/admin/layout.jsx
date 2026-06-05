import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "Merry Berry - Admin",
    description: "Merry Berry store administration",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
