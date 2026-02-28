"use client";

import { ReactNode } from "react";
import CartNotification from "@/app/components/notification/CartNotification";
import { QuickViewProvider } from "./QuickViewContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: Readonly<ProvidersProps>) {
  return (
    <QuickViewProvider>
      {children}
      <CartNotification />
    </QuickViewProvider>
  );
}
