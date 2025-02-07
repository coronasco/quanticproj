import Link from "next/link"

const Premium = () => {
  return (
    <div className="flex flex-col gap-2 items-center text-center justify-center w-full border p-2 rounded-md border-red-300">
        <p className="text-sm text-gray-500">Devi essere Premium per usare questa funzione!</p>
        <Link href='/premium' className="text-sm border-b italic">Diventa Premium</Link>
    </div>
  )
}

export default Premium