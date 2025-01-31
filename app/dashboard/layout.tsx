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
import SidebarReminders from "@/components/sidebarNotifications/sidebarReminders";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import LeftNavigation from "@/components/leftNavigation";

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
        <main className="flex">
          <div className="hidden bg-red-100 md:block">
            <LeftNavigation />
          </div>
          <div className="md:hidden">
            <Header />
          </div>
          <div className="m-2 bg-white rounded-lg border md:ml-[200px] w-full">
            {children}
          </div>
          <div className="col-span-1 hidden lg:block">
            <SidebarReminders />
          </div>
        </main>
        <Toaster />   
      </>
    );
  }
  