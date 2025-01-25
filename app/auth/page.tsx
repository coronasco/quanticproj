import AuthForm from "@/components/authForm";
import Link from "next/link";

const AuthPage = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="border p-4 w-full md:max-w-[400px] m-4 md:m-0">
                <Link href='/' className="text-lg font-semibold flex justify-center">Quantic</Link>
                <h2 className="text-slate-500 text-xl flex justify-center mb-10">Autenticazione</h2>
                <AuthForm />
            </div>
        </div>
    )
}

export default AuthPage