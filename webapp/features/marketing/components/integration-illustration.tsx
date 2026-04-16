import { Receipt } from "lucide-react";

export function IntegrationIllustration() {
  return (
    <div className="relative z-10 flex items-center">
      {/* Invoice card */}
      <div className="bg-illustration corner-tr-bevel ring-border-illustration shadow-black/6.5 relative w-20 rounded-md rounded-tr-[15%] p-2.5 shadow-md ring-1">
        <div className="mb-2 flex items-center gap-1.5">
          <Receipt className="size-3 text-amber-500" />
          <span className="text-[9px] font-semibold">INVOICE</span>
        </div>
        <div className="space-y-1.5">
          <div className="bg-foreground/10 h-0.5 w-full rounded-full" />
          <div className="flex gap-1">
            <div className="bg-foreground/10 h-0.5 w-1/2 rounded-full" />
            <div className="bg-foreground/10 h-0.5 w-1/2 rounded-full" />
          </div>
          <div className="flex gap-1">
            <div className="bg-foreground/10 h-0.5 w-1/4 rounded-full" />
            <div className="bg-foreground/10 h-0.5 w-3/4 rounded-full" />
          </div>
          <div className="flex gap-1">
            <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
            <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
            <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
          </div>
          <div className="bg-foreground/10 h-0.5 w-2/3 rounded-full" />
          <div className="bg-foreground/10 h-0.5 w-3/4 rounded-full" />
          <div className="border-foreground/10 mt-1.5 border-t pt-1.5">
            <div className="flex justify-between">
              <div className="bg-foreground/15 h-0.5 w-6 rounded-full" />
              <div className="h-0.5 w-8 rounded-full bg-amber-500/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Center logo */}
      <div className="mx-26 relative z-10">
        <div className="dark:bg-illustration/75 dark:ring-border-illustration relative flex size-14 items-center justify-center rounded-full bg-black/75 shadow-xl shadow-black/20 ring-1 ring-black backdrop-blur">
          <svg
            className="size-5"
            viewBox="0 0 180 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M80 100H28C12.536 100 0 87.464 0 72V28C0 12.536 12.536 0 28 0H72C87.464 0 100 12.536 100 28V80H160C171.046 80 180 88.9543 180 100V167.639C180 175.215 175.72 182.14 168.944 185.528L103.416 218.292C101.17 219.415 98.6923 220 96.1803 220C87.2442 220 80 212.756 80 203.82V100ZM28 20C23.5817 20 20 23.5817 20 28V72C20 76.4183 23.5817 80 28 80H80V28C80 23.5817 76.4183 20 72 20H28ZM100 100H152C156.418 100 160 103.582 160 108V165.092C160 168.103 158.309 170.859 155.625 172.224L111.625 194.591C106.303 197.296 100 193.429 100 187.459V100Z"
              fill="url(#paint_logo)"
            />
            <defs>
              <linearGradient
                id="paint_logo"
                x1="90"
                y1="0"
                x2="90"
                y2="220"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9B99FE" />
                <stop offset="1" stopColor="#2BC8B7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Neon integration card */}
      <div className="w-32">
        <div className="relative mx-auto w-fit">
          <div className="absolute inset-0 opacity-50 dark:opacity-15">
            <div className="absolute inset-1 animate-pulse rounded-xl bg-gradient-to-r from-[#00E0D9] to-[#63F655] blur-md" />
          </div>
          <div
            className="ring-foreground/15 shadow-black/6.5 bg-radial to-card/50 from-card relative overflow-hidden rounded-xl shadow-md ring-1 backdrop-blur"
            style={{ width: 99 }}
          >
            <div className="relative">
              {/* Hidden spacer */}
              <div className="invisible absolute flex items-center gap-2 whitespace-nowrap py-2 pl-2 pr-3">
                <div className="size-8 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">Neon</div>
                  <div className="text-foreground/65 text-[10px]">Postgres</div>
                </div>
              </div>
              {/* Visible content */}
              <div className="flex items-center gap-2 py-2 pl-2 pr-3">
                <div className="inset-ring-1 dark:inset-ring-foreground/15 inset-ring-foreground/50 flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-950 *:size-4">
                  <NeonLogo />
                </div>
                <div>
                  <div className="text-xs font-semibold">Neon</div>
                  <div className="text-foreground/65 text-[10px]">Postgres</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database tables */}
      <div className="ml-32 flex flex-col gap-48">
        <div className="bg-card/75 ring-border-illustration shadow-black/6.5 w-32 overflow-hidden rounded-xl shadow-md ring-1">
          <div className="flex items-center justify-center px-3 py-1.5">
            <span className="text-xs font-semibold">users</span>
          </div>
          <div className="bg-illustration border-border/50 space-y-1.5 border-t p-3">
            <div className="flex items-center gap-1.5">
              <div className="size-1 rounded-full bg-cyan-500" />
              <span className="text-muted-foreground text-xs">id</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-1 rounded-full bg-cyan-500/50" />
              <span className="text-muted-foreground text-xs">name</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-1 rounded-full bg-cyan-500/50" />
              <span className="text-muted-foreground text-xs">email</span>
            </div>
          </div>
        </div>
        <div className="bg-card/75 ring-border-illustration shadow-black/6.5 w-32 overflow-hidden rounded-xl shadow-md ring-1">
          <div className="flex items-center justify-center px-3 py-1.5">
            <span className="text-xs font-semibold">invoices</span>
          </div>
          <div className="bg-illustration border-border/50 space-y-1.5 border-t p-3">
            <div className="flex items-center gap-1.5">
              <div className="size-1 rounded-full bg-violet-500" />
              <span className="text-muted-foreground text-xs">id</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-1 rounded-full bg-violet-500/50" />
              <span className="text-muted-foreground text-xs">user_id</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-1 rounded-full bg-violet-500/50" />
              <span className="text-muted-foreground text-xs">amount</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NeonLogo() {
  return (
    <svg viewBox="0 0 256 256" preserveAspectRatio="xMidYMid">
      <defs>
        <linearGradient id="neon-a" x1="100%" x2="12.069%" y1="100%" y2="0%">
          <stop offset="0%" stopColor="#62F755" />
          <stop offset="100%" stopColor="#8FF986" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="neon-b"
          x1="100%"
          x2="40.603%"
          y1="100%"
          y2="76.897%"
        >
          <stop offset="0%" stopOpacity=".9" />
          <stop offset="100%" stopColor="#1A1A1A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        fill="#00E0D9"
        d="M0 44.139C0 19.762 19.762 0 44.139 0H211.86C236.238 0 256 19.762 256 44.139v142.649c0 25.216-31.915 36.16-47.388 16.256l-48.392-62.251v75.484c0 21.939-17.784 39.723-39.722 39.723h-76.36C19.763 256 0 236.238 0 211.861V44.14Zm44.139-8.825c-4.879 0-8.825 3.946-8.825 8.818v167.73c0 4.878 3.946 8.831 8.818 8.831h77.688c2.44 0 3.087-1.977 3.087-4.416v-101.22c0-25.222 31.914-36.166 47.395-16.255l48.391 62.243V44.14c0-4.879.455-8.825-4.416-8.825H44.14Z"
      />
      <path
        fill="url(#neon-a)"
        d="M0 44.139C0 19.762 19.762 0 44.139 0H211.86C236.238 0 256 19.762 256 44.139v142.649c0 25.216-31.915 36.16-47.388 16.256l-48.392-62.251v75.484c0 21.939-17.784 39.723-39.722 39.723h-76.36C19.763 256 0 236.238 0 211.861V44.14Zm44.139-8.825c-4.879 0-8.825 3.946-8.825 8.818v167.73c0 4.878 3.946 8.831 8.818 8.831h77.688c2.44 0 3.087-1.977 3.087-4.416v-101.22c0-25.222 31.914-36.166 47.395-16.255l48.391 62.243V44.14c0-4.879.455-8.825-4.416-8.825H44.14Z"
      />
      <path
        fill="url(#neon-b)"
        fillOpacity=".4"
        d="M0 44.139C0 19.762 19.762 0 44.139 0H211.86C236.238 0 256 19.762 256 44.139v142.649c0 25.216-31.915 36.16-47.388 16.256l-48.392-62.251v75.484c0 21.939-17.784 39.723-39.722 39.723h-76.36C19.763 256 0 236.238 0 211.861V44.14Zm44.139-8.825c-4.879 0-8.825 3.946-8.825 8.818v167.73c0 4.878 3.946 8.831 8.818 8.831h77.688c2.44 0 3.087-1.977 3.087-4.416v-101.22c0-25.222 31.914-36.166 47.395-16.255l48.391 62.243V44.14c0-4.879.455-8.825-4.416-8.825H44.14Z"
      />
      <path
        fill="#63F655"
        d="M211.861 0C236.238 0 256 19.762 256 44.139v142.649c0 25.216-31.915 36.16-47.388 16.256l-48.392-62.251v75.484c0 21.939-17.784 39.723-39.722 39.723a4.409 4.409 0 0 0 4.409-4.409V115.058c0-25.223 31.914-36.167 47.395-16.256l48.391 62.243V8.825c0-4.871-3.953-8.825-8.832-8.825Z"
      />
    </svg>
  );
}
