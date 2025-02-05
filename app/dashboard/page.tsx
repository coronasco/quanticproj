import AddExpense from "@/components/addExpense";
import AddIncome from "@/components/addIncome";
import Analytics from "@/components/dashboard/analytics";
import CashFlow from "@/components/dashboard/cashFlow";
import ExpenseCategoryBar from "@/components/dashboard/expenseCategoryBar";
import MonthlyGoal from "@/components/dashboard/monthlyGoal";
import MonthlyProfitIncome from "@/components/dashboard/monthlyProfitIncome";

const Dashboard = () => {

  const profit = 0;

  return (
    <div className="mt-[40px] md:mt-0 px-4 md:px-6 py-4">
      {/* 🔹 Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          <AddIncome />
          <AddExpense />
        </div>
      </div>

      {/* 🔹 Profit Section */}
      <div className="mt-4">
        <MonthlyProfitIncome />
      </div>

      {/* 🔹 Grid Layout pentru principalele componente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <ExpenseCategoryBar />
        <MonthlyGoal />
      </div>

      {/* 🔹 Ultima secțiune cu Analytics și CashFlow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <CashFlow profit={profit} />
        <Analytics />
      </div>
    </div>
  );

}

export default Dashboard