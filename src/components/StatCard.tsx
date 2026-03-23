interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard = ({ title, value, subtitle, icon, colorClass }: StatCardProps) => (
  <div className="bg-card rounded-2xl border border-border p-5 hover-lift">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm font-medium text-foreground">{title}</p>
    {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
  </div>
);

export default StatCard;
