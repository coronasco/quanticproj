import { BadgeHelp, DoorOpen, LayoutDashboard, List, Settings, SquareCheck, Wallet } from "lucide-react"
import Link from "next/link"
import LogoutButton from "./logOutButton"

const LeftNavigation = () => {
    return (
        <div className="fixed left-0 top-0">
            <div className="flex flex-col w-[200px] h-screen">
                <div className="p-4 md:p-6">
                    <h1 className="text-2xl">Quantic</h1>
                    <p className="mb-10 text-xs text-gray-500">Master Finance</p>
                </div>
                <ul className="p-2">
                    <h2 className="text-xs text-gray-500 px-2 md:px-4 mb-2">General</h2>
                    <li className="flex items-center hover:bg-gray-200 hover:text-gray-800 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group">
                        <LayoutDashboard className="w-5 h-5 mr-2 group-hover:scale-150 group-hover:rotate-180 transition-all" />
                        <Link href="/dashboard" className="w-full p-2">
                            Dashboard
                        </Link>
                    </li>
                    <li className="flex items-center hover:bg-gray-200 hover:text-gray-800 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group">
                        <Wallet className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />
                        <Link href="/dashboard/income" className="w-full p-2">
                            Incasso
                        </Link>
                    </li>
                    <li className="flex items-center hover:bg-gray-200 hover:text-gray-800 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group">
                        <DoorOpen className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />
                        <Link href="/dashboard/expenses" className="w-full p-2">
                            Spese
                        </Link>
                    </li>
                    <li className="flex items-center hover:bg-gray-200 hover:text-gray-800 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group">
                        <List className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />
                        <Link href="/dashboard/list" className="w-full p-2">
                            List
                        </Link>
                    </li>
                    <li className="flex items-center hover:bg-gray-200 hover:text-gray-800 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group">
                        <SquareCheck className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />
                        <Link href="/dashboard/notifications" className="w-full p-2">
                            Notifiche
                        </Link>
                    </li>

                </ul>
                <ul className="mt-5 p-2 mb-auto">
                    <h2 className="text-xs text-gray-500 px-2 md:px-4 mb-2">Support</h2>
                    <li className="flex items-center hover:bg-gray-200 hover:text-gray-800 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group">
                        <Settings className="w-5 h-5 mr-2 group-hover:scale-150 group-hover:rotate-180 transition-all" />
                        <Link href="/dashboard/settings" className="w-full p-2">
                            Settings
                        </Link>
                    </li>
                    <li className="flex items-center hover:bg-gray-200 hover:text-gray-800 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group">
                        <BadgeHelp className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />
                        <Link href="/dashboard/help" className="w-full p-2">
                            Help & Center
                        </Link>
                    </li>
                </ul>
                <div className="mb-5 bg-white mx-4 rounded-md border flex items-center">
                    <LogoutButton />
                </div>
            </div>
        </div>
    )
}

export default LeftNavigation