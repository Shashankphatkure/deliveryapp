"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  WalletIcon,
  BellIcon,
  TruckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Orders", href: "/orders", icon: TruckIcon },
    { name: "Earnings", href: "/earnings", icon: WalletIcon },
    { name: "Notifications", href: "/notifications", icon: BellIcon },
    { name: "Profile", href: "/profile", icon: UserIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <nav className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center p-2 ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
