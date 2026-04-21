export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 ${className}`}>
      {children}
    </div>
  )
}