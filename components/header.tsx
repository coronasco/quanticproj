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
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "./themeToggle";

const Header = () => {
  return (
    <header className="border-b w-full fixed top-0 left-0 z-50 bg-white">
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
                  <div className="flex flex-col w-[200px] h-screen">
                    <div className="p-4 md:p-6">
                      <h1 className="text-2xl">Quantic</h1>
                      <p className="mb-10 text-xs text-gray-500">Master Finance</p>
                    </div>
                    <ul className="p-2">
                      <h2 className="text-xs text-gray-500 px-2 md:px-4 mb-2">General</h2>
                      <li className="flex items-center hover:bg-gray-200 hover:text-gray-800 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group">
                        <LayoutDashboard className="w-5 h-5 mr-2 group-hover:scale-150 group-hover:rotate-180 transition-all" />
                        <SheetClose asChild>
                          <Link href="/dashboard" className="w-full p-2">
                            Dashboard
                          </Link>
                        </SheetClose>
                      </li>
                      <li className="flex items-center hover:bg-gray-200 hover:text-gray-800 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group">
                        <Wallet className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />
                        <SheetClose asChild>
                          <Link href="/dashboard/income" className="w-full p-2">
                            Incasso
                          </Link>
                        </SheetClose>
                      </li>
                      <li className="flex items-center hover:bg-gray-200 hover:text-gray-800 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group">
                        <DoorOpen className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />
                        <SheetClose asChild>
                          <Link href="/dashboard/expenses" className="w-full p-2">
                            Spese
                          </Link>
                        </SheetClose>
                      </li>
                      <li className="flex items-center hover:bg-gray-200 hover:text-gray-800 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group">
                        <List className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />
                        <SheetClose asChild>
                          <Link href="/dashboard/list" className="w-full p-2">
                            List
                          </Link>
                        </SheetClose>
                      </li>
                      <li className="flex items-center hover:bg-gray-200 hover:text-gray-800 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group">
                        <SquareCheck className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />
                        <SheetClose asChild>
                          <Link href="/dashboard/notifications" className="w-full p-2">
                            Notifiche
                          </Link>
                        </SheetClose>
                      </li>

                    </ul>
                    <ul className="mt-5 p-2 mb-auto">
                      <h2 className="text-xs text-gray-500 px-2 md:px-4 mb-2">Support</h2>
                      <li className="flex items-center hover:bg-gray-200 hover:text-gray-800 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group">
                        <Settings className="w-5 h-5 mr-2 group-hover:scale-150 group-hover:rotate-180 transition-all" />
                        <SheetClose asChild>
                          <Link href="/dashboard/settings" className="w-full p-2">
                            Settings
                          </Link>
                        </SheetClose>
                      </li>
                      <li className="flex items-center hover:bg-gray-200 hover:text-gray-800 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group">
                        <BadgeHelp className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />
                        <SheetClose asChild>
                          <Link href="/dashboard/help" className="w-full p-2">
                            Help & Center
                          </Link>
                        </SheetClose>
                      </li>
                    </ul>
                    <div className="mb-20 bg-white mx-4 rounded-md border flex items-center">
                      <LogoutButton />
                    </div>
                  </div>

                </SheetContent>
              </Sheet>
            </li>
          </ul>
        </div>
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
