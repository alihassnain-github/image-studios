import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function Layout({
    children,
    modal,
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            {children}
            {modal}
            <Footer />
        </>
    )
}