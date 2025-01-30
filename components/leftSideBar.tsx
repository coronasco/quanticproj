import { BadgeHelp, DoorOpen, LayoutDashboard, List, Settings, SquareCheck, Wallet } from "lucide-react"
import Link from "next/link"


const LeftSideBar = () => {
  return (
    <div className="hidden md:flex flex-col justify-between pt-[100px] pb-[40px] h-screen border-r w-[230px]">
      <ul className="">
        <li className="flex items-center hover:bg-gray-100 px-4 transition-all  text-gray-500 hover:text-gray-600">
          <LayoutDashboard className="w-5 h-5 mr-2" />
          <Link href="/dashboard" className="w-full p-2">
            Dashboard
          </Link>
        </li>
        <li className="flex items-center hover:bg-gray-100 px-4 transition-all  text-gray-500 hover:text-gray-600">
          <Wallet className="w-5 h-5 mr-2" />
          <Link href="/dashboard/income" className="w-full p-2">
            Income
          </Link>
        </li>
        <li className="flex items-center hover:bg-gray-100 px-4 transition-all  text-gray-500 hover:text-gray-600">
          <DoorOpen className="w-5 h-5 mr-2" />
          <Link href="/dashboard/expenses" className="w-full p-2">
            Spese
          </Link>
        </li>
        <li className="flex items-center hover:bg-gray-100 px-4 transition-all text-gray-500 hover:text-gray-600">
          <List className="w-5 h-5 mr-2" />
          <Link href="/dashboard/list" className="w-full p-2">
            List
          </Link>
        </li>
        <li className="flex items-center hover:bg-gray-100 px-4 transition-all text-gray-500 hover:text-gray-600">
          <SquareCheck className="w-5 h-5 mr-2" />
          <Link href="/dashboard/notifications" className="w-full p-2">
            Notifications
          </Link>
        </li>
        </ul>
        <ul>
        <li className="flex items-center hover:bg-gray-100 px-4 transition-all text-gray-500 hover:text-gray-600">
          <Settings className="w-5 h-5 mr-2" />
          <Link href="/dashboard/settings" className="w-full p-2">
            Settings
          </Link>
        </li>
        <li className="flex items-center hover:bg-gray-100 px-4 transition-all text-gray-500 hover:text-gray-600">
          <BadgeHelp className="w-5 h-5 mr-2" />
          <Link href="/dashboard/help" className="w-full p-2">
            Help
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default LeftSideBar