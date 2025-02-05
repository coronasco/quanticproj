import Link from 'next/link';
import { SheetClose } from './ui/sheet';
const NavItem = ({icon, link, text}: {icon: JSX.Element; link: string; text: string}) => {
  return (
    <li className="flex items-center hover:bg-gray-200 hover:text-gray-800 hover:pl-4 hover:font-semibold transition-all  text-gray-500  px-2 md:px-4 rounded-md group">
        {icon}
        <Link href={link} className="w-full p-2">
            {text}
        </Link>
    </li>
  )
}

export default NavItem