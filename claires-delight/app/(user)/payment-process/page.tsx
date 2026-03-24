import ResponsiveFooter from "@/app/components/footer/responsive/ResponsiveFooter";
import EnhancedNavbar from "@/app/components/header/navbar/EnhancedNavbar";
import PaymentOrder from "@/app/components/order/PaymentOrder";

export default function Page() {
  return (
   <>
    <EnhancedNavbar />
      <PaymentOrder />
      <ResponsiveFooter />
   </>
  );
}
