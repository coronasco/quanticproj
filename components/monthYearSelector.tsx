import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

const MonthYearSelector = ({ selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }: any) => {
    const today = new Date()
  return (
    <div className="flex gap-1">
          <Select onValueChange={(value) => setSelectedMonth(parseInt(value))} defaultValue={selectedMonth.toString()}>
            <SelectTrigger className="w-[75px]">
              <SelectValue placeholder="Mese" />
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((month, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setSelectedYear(parseInt(value))} defaultValue={selectedYear.toString()}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Anno" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }).map((_, index) => {
                const year = today.getFullYear() - index;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
  )
}

export default MonthYearSelector