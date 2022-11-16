import Navbar from "components/Navbar";
import Footer from "components/Footer";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
