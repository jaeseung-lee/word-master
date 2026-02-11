"use client";

import React, { useState } from "react";
import {
  LucideMenu,
  MessageSquareText,
  BookOpen,
  UserCircle,
  LogOut,
} from "lucide-react";
import LogoImage from "@/../public/image/logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModalLayout } from "../modal/ModalLayout";
import ModalProvider from "../modal/ModalProvider";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { logoutAction } from "@/app/actions/auth";

const menuItems = [
  { icon: MessageSquareText, labelKey: "menu.sentences", href: "/" },
  { icon: BookOpen, labelKey: "menu.words", href: "/words" },
];

export default function Menu() {
  const t = useTranslations();
  const [isMenuModalOpened, setIsMenuModalOpened] = useState(false);
  const pathname = usePathname();

  return (
    <React.Fragment>
      <div className="sticky top-0 z-10 flex">
        <div className="mx-auto flex h-14 w-full items-center justify-between px-[1em]">
          <Link href="/dashboard">
            <Image src={LogoImage} alt="logo" width={32} height={32} />
          </Link>
          <button
            onClick={() => setIsMenuModalOpened(true)}
            className="border border-gray-04 bg-light-black rounded-md p-[0.5em] flex items-center justify-center w-[2em] h-[2em]"
          >
            <LucideMenu className="w-[1em] h-[1em] text-gray-02" />
          </button>
        </div>
      </div>
      <ModalProvider>
        {isMenuModalOpened && (
          <ModalLayout
            modalType="bottom-to-top"
            closeModal={() => setIsMenuModalOpened(false)}
          >
            <nav className="flex flex-col">
              {menuItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/" || pathname === "/ko"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuModalOpened(false)}
                    className={`flex items-center gap-3 p-2 transition-colors ${
                      isActive
                        ? "bg-gray-04 text-white"
                        : "text-gray-02 hover:bg-gray-04/50 hover:text-gray-01"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 flex-none ${
                        isActive ? "text-white" : "text-gray-03"
                      }`}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                    <span
                      className={`text-sm ${
                        isActive ? "font-semibold" : "font-normal"
                      }`}
                    >
                      {t(item.labelKey)}
                    </span>
                  </Link>
                );
              })}
              <div className="mt-2 border-t border-gray-04 pt-2">
                <Link
                  href="/profile"
                  onClick={() => setIsMenuModalOpened(false)}
                  className={`flex items-center gap-3 p-2 transition-colors ${
                    pathname.startsWith("/profile")
                      ? "bg-gray-04 text-white"
                      : "text-gray-02 hover:bg-gray-04/50 hover:text-gray-01"
                  }`}
                >
                  <UserCircle
                    className={`h-5 w-5 flex-none ${
                      pathname.startsWith("/profile")
                        ? "text-white"
                        : "text-gray-03"
                    }`}
                    strokeWidth={pathname.startsWith("/profile") ? 2 : 1.5}
                  />
                  <span
                    className={`text-sm ${
                      pathname.startsWith("/profile")
                        ? "font-semibold"
                        : "font-normal"
                    }`}
                  >
                    {t("menu.profile")}
                  </span>
                </Link>
                <button
                  onClick={async () => {
                    setIsMenuModalOpened(false);
                    await logoutAction();
                  }}
                  className="flex w-full items-center gap-3 p-2 text-gray-02 transition-colors hover:bg-gray-04/50 hover:text-gray-01"
                >
                  <LogOut
                    className="h-5 w-5 flex-none text-gray-03"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm font-normal">
                    {t("auth.logout")}
                  </span>
                </button>
              </div>
            </nav>
          </ModalLayout>
        )}
      </ModalProvider>
    </React.Fragment>
  );
}
