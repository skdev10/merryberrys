import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Merry Berry - Store Dashboard",
    description: "Merry Berry store dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
