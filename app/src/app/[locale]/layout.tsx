import React from "react";
import Menu from "@/components/ui/menu/Menu";

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="bg-black text-white flex flex-col w-screen h-screen">
      <div className="shrink-0 border-b border-gray-04">
        <Menu />
      </div>
      <div className="flex flex-1 w-full overflow-y-hidden">{children}</div>
    </div>
  );
}
