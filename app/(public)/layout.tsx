import { Header } from "./components/header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={"theme-fronted w-screen h-screen flex flex-col"}>
      <Header />
      <main className={"flex-1 overflow-y-auto"}>{children}</main>
    </div>
  );
}
