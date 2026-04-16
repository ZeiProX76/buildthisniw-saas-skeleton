import React from "react";

export function AuthDivider(): React.ReactElement {
  return (
    <div className="relative my-1">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground sm:bg-card">
          or
        </span>
      </div>
    </div>
  );
}
