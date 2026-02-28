import ErrorBoundary from "@/app/components/ErrorBoundary";
import PaymentOrder from "@/app/components/order/PaymentOrder";

export default function Page() {
  return (
    <ErrorBoundary>
      <PaymentOrder />
    </ErrorBoundary>
  );
}
