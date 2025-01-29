import MonthlyProfit from "@/components/dashboard/monthlyProfit"
import MonthlyProfitIncome from "@/components/dashboard/monthlyProfitIncome";

const Dashboard = () => {

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  return (
    <div className="mt-[70px] md:mt-[80px]">
      <h1 className="text-xl font-semibold p-4 md:p-6">Dashboard</h1>
      <div className="p-4 md:p-6">
        <MonthlyProfitIncome month={month} />
      </div>
      <div className="p-4 md:p-6 mt-4">
        <MonthlyProfit />      
      </div>
    </div>
  )
}

export default Dashboard