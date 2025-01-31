import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const CashFlow = ({ profit }: { profit: number }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Flusso di Cassa</CardTitle>
            </CardHeader>
            <CardContent>
                <p className={`text-2xl font-bold ${profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {profit.toFixed(2)}€
                </p>
                <p className="text-sm text-gray-500">Disponibile alla fine del mese</p>
            </CardContent>
        </Card>
    );
};

export default CashFlow