import AddExpense from "@/components/addExpense";
import AddIncome from "@/components/addIncome";
import CashFlow from "@/components/dashboard/cashFlow";
import ExpenseCategoryBar from "@/components/dashboard/expenseCategoryBar";
import MonthlyGoal from "@/components/dashboard/monthlyGoal";
import MonthlyProfitIncome from "@/components/dashboard/monthlyProfitIncome";

const Dashboard = () => {

  const profit = 0;

  return (
    <div className="mt-[40px] md:mt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold p-4 md:px-6">Dashboard</h1>  
        <div className="flex items-center gap-2 pr-4 md:pr-6">
          <AddIncome />
          <AddExpense />
        </div>
      </div>
      <div className="px-4 md:px-6">
        <MonthlyProfitIncome />
      </div>
      <div className="px-4 md:p-6 mt-4 md:mt-0 flex flex-col lg:flex-row gap-2">
        <div className="w-full">
          <ExpenseCategoryBar />
        </div>
        <div className="w-full">
          <MonthlyGoal />
        </div>
      </div>
      <div className="px-4 md:p-6 mt-4 md:mt-0 flex flex-col lg:flex-row gap-2">
        <div className="w-full">
            <CashFlow profit={profit} />
        </div>
        <div className="w-full"></div>
        
      </div>
    </div>
  )
}

export default Dashboard