import React from "react";
import Menu from "@/components/ui/menu/Menu";

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="bg-black text-white w-screen min-h-screen">
      <Menu />
      <div className="w-full">{children}</div>
    </div>
  );
}
