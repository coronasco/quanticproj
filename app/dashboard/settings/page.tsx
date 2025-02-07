import { Separator } from '@/components/ui/separator'
import Achievements from '@/components/user/achievements'
import DailyMissions from '@/components/user/dailyMissions'
import Gamification from '@/components/user/gamification'
import MonthlyChallenges from '@/components/user/monthlyChallenges'
import Trivia from '@/components/user/trivia'

import UserProfile from '@/components/user/userProfile'

const Settings = () => {
  return (
    <div className='mt-[40px] md:mt-0 p-4 md:-6'>
      <h1 className='text-lg'>Impostazioni</h1>
      <h2 className='text-md font-semibold my-2'>Profilo</h2>
      <UserProfile />
      <div className='lg:hidden'>
        <Separator className='my-4' />
        <Gamification />
        <Separator className='my-4' />
        <Achievements />
        <Separator className='my-4' />
        <Trivia />
      </div>
      <Separator className='my-4' />
      <DailyMissions />
      <Separator className='my-4' />
      <MonthlyChallenges />
    </div>
  )
}

export default Settings