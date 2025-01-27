import { DoorOpen, List, SquareCheck, Wallet } from "lucide-react"
import Link from "next/link"


const LeftSideBar = () => {
  return (
    <ul className="hidden md:flex flex-col pt-[100px] h-screen border-r w-[230px]">
        <li className="flex items-center hover:bg-gray-100 px-4 transition-all  text-gray-500 hover:text-gray-600">
            <Wallet className="w-5 h-5 mr-2" />
            <Link href='/dashboard/income' className="w-full p-2">Income</Link>
        </li>
        <li className="flex items-center hover:bg-gray-100 px-4 transition-all  text-gray-500 hover:text-gray-600">
            <DoorOpen className="w-5 h-5 mr-2" />
            <Link href='/dashboard/expenses' className="w-full p-2">Spese</Link>
        </li>
        <li className="flex items-center hover:bg-gray-100 px-4 transition-all text-gray-500 hover:text-gray-600">
            <List className="w-5 h-5 mr-2" />
            <Link href='/dashboard/list' className="w-full p-2">List</Link>
        </li>
        <li className="flex items-center hover:bg-gray-100 px-4 transition-all text-gray-500 hover:text-gray-600">
            <SquareCheck className="w-5 h-5 mr-2" />
            <Link href='/dashboard/notifications' className="w-full p-2">Notifications</Link>
        </li>
    </ul>
  )
}

export default LeftSideBar