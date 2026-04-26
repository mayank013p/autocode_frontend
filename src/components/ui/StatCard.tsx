import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  accent: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, change, isPositive, accent }) => {
  return (
    <div className="glass-card p-6 flex flex-col justify-between">
      <div>
        <p className="text-[10px] text-dim font-bold tracking-widest uppercase mb-4">{label}</p>
        <h3 className="text-3xl font-bold mb-6">{value}</h3>
      </div>

      <div
        className="flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-bold"
        style={{ backgroundColor: `${accent}15`, color: accent }}
      >
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{change} this week</span>
      </div>
    </div>
  );
};

export default StatCard;
