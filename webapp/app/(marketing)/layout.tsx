import { Header } from "@/features/marketing/components/header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
    </div>
  );
}
