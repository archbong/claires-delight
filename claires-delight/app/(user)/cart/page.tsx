import CartView from "@/app/components/cart/CartView";
import ResponsiveFooter from "@/app/components/footer/responsive/ResponsiveFooter";
import Navbar from "@/app/components/header/navbar/Navbar";

function page() {
  return (
    <div className="px-0">
      <Navbar />
      <CartView />
      <ResponsiveFooter />
    </div>
  );
}

export default page;
