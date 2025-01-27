import MonthlyProfit from "@/components/dashboard/monthlyProfit"

const Dashboard = () => {

  return (
    <div className="mt-[70px] md:mt-[80px]">
      <h2>Profitto mensile di questo mese.</h2>
      <MonthlyProfit/>      
    </div>
  )
}

export default Dashboard