import { useState } from "react"
import { usePremium } from "@/hooks/usePremium"
import { BadgeHelp, ChevronDown, ChevronUp, Coffee, DoorOpen, LayoutDashboard, Lightbulb, List, ListCheck, Settings, Wallet } from "lucide-react"
import LogoutButton from "./logOutButton"
import UpgrateButton from "./upgrateButton"
import NavItem from "./navItem"

const LeftNavigation = () => {
    const isPremium = usePremium()

    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="fixed left-0 top-0">
            <div className="flex flex-col w-[200px] h-screen">
                <div className="p-4 md:p-6">
                    <h1 className="text-2xl">Quantic</h1>
                    <p className="mb-10 text-xs text-gray-500">Master Finance - {isPremium ? <span className="font-semibold">Premium</span> : <span className="font-semibold">Basic</span>}</p>
                </div>
                <ul className="p-2">
                    <h2 className="text-xs text-gray-500 px-2 md:px-4 mb-2">General</h2>
                    <NavItem icon={<LayoutDashboard className="w-5 h-5 mr-2 group-hover:scale-150 transition-all"/>} link='/dashboard' text='Dashboard' />
                    <NavItem icon={<Wallet className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />} link='/dashboard/income' text="Incasso" />
                    <NavItem icon={<DoorOpen className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />} link='/dashboard/expenses' text="Spese" />
                    
                    <li className="relative ">
                        <button
                            className="flex items-center w-full justify-between hover:bg-gray-200 hover:pl-4 hover:text-gray-800 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group"
                            onClick={() => setIsOpen(!isOpen)}
                        >   
                            <div className="flex items-center gap-1 py-2">
                                <div>
                                    <List className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />
                                </div>
                                <span className="w-full ml-[1px]">Lista</span>
                            </div>
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {/* 🔹 Dropdown menu */}

                        {isOpen && (
                            <ul className="ml-4 pl-2 text-xs border-l mt-1 space-y-1">
                                <NavItem icon={<ListCheck className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />} link="/dashboard/list/shopping" text="Lista spese" />
                                <NavItem icon={<Coffee className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />} link="/dashboard/list/inventory" text="Prodotti" />
                            </ul>
                        )}
                    </li>


                </ul>
                <ul className="mt-5 p-2">
                    <h2 className="text-xs text-gray-500 px-2 md:px-4 mb-2">Finanze</h2>
                    <NavItem icon={<Lightbulb className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />} link="/dashboard/reminders" text="Scadenze" />
                </ul>
                <ul className="mt-5 p-2 mb-auto">
                    <h2 className="text-xs text-gray-500 px-2 md:px-4 mb-2">Support</h2>
                    
                    <NavItem icon={<Settings className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />} link="/dashboard/settings" text="Impostazioni" />
                    <NavItem icon={<BadgeHelp className="w-5 h-5 mr-2 group-hover:scale-150 transition-all" />} link="/dashboard/helpcenter" text="Help & Center" />
                    
                </ul>
                <div className="flex items-center mb-5  px-2 md:px-4 group">
                    <UpgrateButton />
                </div>
                <div className="mb-5 bg-white mx-4 rounded-md border flex items-center">
                    
                    <LogoutButton />
                </div>
            </div>
        </div>
    )
}

export default LeftNavigation