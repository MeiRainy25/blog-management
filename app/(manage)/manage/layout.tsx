import { TooltipProvider } from "@/components/ui/tooltip";
import ManageSidebar, { ManageSidebarProvider } from "./components/sidebar";
import ManageHeader from "./components/header";

export default function ManageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TooltipProvider>
      <ManageSidebarProvider defaultOpen={false}>
        <div className={"flex flex-col min-h-screen"}>
          <ManageHeader />
          <main className={"flex flex-1"}>
            <ManageSidebar />
            <div className={"p-1 w-full"}>{children}</div>
          </main>
        </div>
      </ManageSidebarProvider>
    </TooltipProvider>
  );
}
