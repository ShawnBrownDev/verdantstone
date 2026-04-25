"use client";

import { Command, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminSearchInput({
  defaultQuery,
  tab,
}: {
  defaultQuery: string;
  tab: "overview" | "pipeline";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(defaultQuery);

  useEffect(() => {
    setValue(defaultQuery);
  }, [defaultQuery]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (value.trim()) params.set("q", value.trim());
      if (tab === "pipeline") params.set("tab", "pipeline");
      const query = params.toString();
      const href = query ? `${pathname}?${query}` : pathname;
      router.replace(href, { scroll: false });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, router, tab, value]);

  return (
    <div className="flex w-full max-w-xl items-center gap-3 rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
      <Search className="size-4" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search leads, services, status..."
        className="h-7 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        aria-label="Search dashboard leads"
      />
      <span className="hidden items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-xs font-medium text-foreground sm:inline-flex">
        <Command className="size-3" aria-hidden />K
      </span>
    </div>
  );
}
