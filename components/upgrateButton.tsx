import { usePremium } from "@/hooks/usePremium"
import { Button } from "./ui/button"
import Link from "next/link"

const UpgrateButton = () => {
    const isPremium = usePremium()
  return (
    <>
      {isPremium ? <></> : <Link href='/premium'><Button>Upgrade to Premium</Button></Link>}
    </>
  )
}

export default UpgrateButton