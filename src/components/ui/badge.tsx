import { cn } from "@/lib/utils"

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800", className)}>
      {children}
    </span>
  )
} 