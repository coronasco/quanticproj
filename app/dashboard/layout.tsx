'use client'
import Header from "@/components/header";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import LeftSideBar from "@/components/leftSideBar";

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if(!loading && !user) {
        router.replace("/auth") // Redirect only if user is not logged in
      }
    }, [user, loading, router])

    if(loading) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      )
    }

    return (
      <>
        <Header />
        <main>
          <ResizablePanelGroup direction="horizontal" className="w-full">
            <LeftSideBar />
            <ResizablePanel defaultSize={75}>
              {children}
            </ResizablePanel>
            <ResizableHandle withHandle className="hidden lg:flex"/>
            <ResizablePanel defaultSize={25} className="min-w-[230px] hidden lg:block">
              <div className="hidden md:block h-screen mt-[100px]">Notification sidebar</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>     
        <Toaster />   
      </>
    );
  }
  