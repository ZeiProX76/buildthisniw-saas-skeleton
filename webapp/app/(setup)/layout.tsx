import { SetupHeader } from "@/features/setup/components/setup-header";

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <SetupHeader />
      {children}
    </div>
  );
}
