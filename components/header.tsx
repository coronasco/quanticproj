import { List, Menu, SquareCheck, Wallet } from "lucide-react"
import Link from "next/link"
import LogoutButton from "./logOutButton"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


const Header = () => {
  return (
    <header className="border-b w-full fixed top-0 left-0 bg-white z-50">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <Link href='/dashboard' className="block text-sm font-semibold p-4 md:p-6 border-r">Quantic</Link>
                <div className="p-4 md:hidden border-r">
                    <Sheet>
                      <SheetTrigger><Menu /></SheetTrigger>
                      <SheetContent side='left'>
                        <SheetHeader className="text-left">
                          <SheetTitle className="text-sm mt-10">Navigation</SheetTitle>
                        </SheetHeader>
                          <ul className="flex flex-col mt-4">
                            <li className="flex items-center hover:bg-gray-100 transition-all p-2 text-gray-500 hover:text-gray-600">
                              <Wallet className="w-5 h-5 mr-2" />
                              <Link href='/dashboard/income' className="w-full">Income</Link>
                            </li>
                            <li className="flex items-center hover:bg-gray-100 transition-all p-2 text-gray-500 hover:text-gray-600">
                              <List className="w-5 h-5 mr-2" />
                              <Link href='/dashboard/list' className="w-full">List</Link>
                            </li>
                            <li className="flex items-center hover:bg-gray-100 transition-all p-2 text-gray-500 hover:text-gray-600">
                              <SquareCheck className="w-5 h-5 mr-2" />
                              <Link href='/dashboard/notifications' className="w-full">Notifications</Link>
                            </li>
                          </ul>
                      </SheetContent>
                    </Sheet>
                </div>
            </div>
            <LogoutButton />
        </div>
    </header>
  )
}

export default Header