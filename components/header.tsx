import {
  BadgeHelp,
  DoorOpen,
  LayoutDashboard,
  List,
  Menu,
  Settings,
  SquareCheck,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "./logOutButton";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "./themeToggle";

const Header = () => {
  return (
    <header className="border-b w-full fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between">
        <div>
          <ul className="flex h-[50px] lg:h-[70px]">
            <li className="px-4 md:px-6 flex items-center border-r h-full">
              <Link href="/dashboard" className="block text-sm font-semibold">
                Quantic
              </Link>
            </li>
            <li className="px-4 h-full flex items-center md:hidden border-r">
              <Sheet>
                <SheetTrigger>
                  <Menu />
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader className="text-left">
                    <SheetTitle className="text-sm mt-10">
                      Navigation
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex flex-col gap-12">
                    <ul className="flex flex-col mt-4">
                      <li className="flex items-center hover:bg-gray-100 transition-all p-2 text-gray-500 hover:text-gray-600">
                        <LayoutDashboard className="w-5 h-5 mr-2" />
                        <SheetClose asChild>
                          <Link href="/dashboard" className="w-full">
                            Dashboard
                          </Link>
                        </SheetClose>
                      </li>
                      <li className="flex items-center hover:bg-gray-100 transition-all p-2 text-gray-500 hover:text-gray-600">
                        <Wallet className="w-5 h-5 mr-2" />
                        <SheetClose asChild>
                          <Link href="/dashboard/income" className="w-full">
                            Income
                          </Link>
                        </SheetClose>
                      </li>
                      <li className="flex items-center hover:bg-gray-100 transition-all p-2 text-gray-500 hover:text-gray-600">
                        <DoorOpen className="w-5 h-5 mr-2" />
                        <SheetClose asChild>
                          <Link href="/dashboard/expenses" className="w-full">
                            Spese
                          </Link>
                        </SheetClose>
                      </li>
                      <li className="flex items-center hover:bg-gray-100 transition-all p-2 text-gray-500 hover:text-gray-600">
                        <List className="w-5 h-5 mr-2" />
                        <SheetClose asChild>
                          <Link href="/dashboard/list" className="w-full">
                            List
                          </Link>
                        </SheetClose>
                      </li>
                      <li className="flex items-center hover:bg-gray-100 transition-all p-2 text-gray-500 hover:text-gray-600">
                        <SquareCheck className="w-5 h-5 mr-2" />
                        <SheetClose asChild>
                          <Link
                            href="/dashboard/notifications"
                            className="w-full"
                          >
                            Notifications
                          </Link>
                        </SheetClose>
                      </li>
                    </ul>
                    <ul>
                      <li className="flex items-center hover:bg-gray-100 transition-all p-2 text-gray-500 hover:text-gray-600">
                        <Settings className="w-5 h-5 mr-2" />
                        <SheetClose asChild>
                          <Link href="/dashboard/settings" className="w-full">
                            Settings
                          </Link>
                        </SheetClose>
                      </li>
                      <li className="flex items-center hover:bg-gray-100 transition-all p-2 text-gray-500 hover:text-gray-600">
                        <BadgeHelp className="w-5 h-5 mr-2" />
                        <SheetClose asChild>
                          <Link href="/dashboard/help" className="w-full">
                            Help
                          </Link>
                        </SheetClose>
                      </li>
                    </ul>
                  </div>
                  
                </SheetContent>
              </Sheet>
            </li>
          </ul>
        </div>
        <div className="flex items-center">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
