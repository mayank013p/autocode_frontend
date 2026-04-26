import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import StatCard from '../components/ui/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { Loader2 } from 'lucide-react';
import type { NoteData } from './Notes';
import './Dashboard.css';

const COLORS = ['#00d2ff', '#3b82f6', '#a855f7', '#ff2d55', '#ffd600', '#10b981'];

interface DashboardSummary {
  totalSolved: number;
  weeklySolved: number;
  accuracy: string;
  timeSpent: string;
  currentStreak: number;
}

interface ActivityItem {
  name: string;
  solved: number;
  attempted: number;
}

interface TopicItem {
  name: string;
  value: number;
  color: string;
}

interface DashboardProps {
  onOpenNote: (note: NoteData) => void;
  onViewAll: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onOpenNote, onViewAll }) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [recentNotes, setRecentNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, actRes, topRes, notesRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getActivity(),
          dashboardService.getTopics(),
          dashboardService.getRecentNotes()
        ]);

        setSummary(sumRes);
        setActivity(actRes.map((item: { label: string; solved: string | number; attempted: string | number }) => ({
          name: item.label,
          solved: Number(item.solved),
          attempted: Number(item.attempted)
        })));

        setTopics(topRes
          .filter((item: { topic: string }) => item.topic && item.topic.trim() !== '')
          .map((item: { topic: string; count: string | number }, index: number) => ({
            name: item.topic,
            value: Number(item.count),
            color: COLORS[index % COLORS.length]
          })));

        setRecentNotes(notesRes.slice(0, 3));
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header
        title="Dashboard"
        subtitle="// daily.deepwork() — your coding session vitals"
      />

      <div className="stat-grid">
        <StatCard label="Problems Solved" value={(summary?.totalSolved || 0).toString()} change={`+${summary?.weeklySolved || 0}`} isPositive={true} accent="#10b981" />
        <StatCard label="Accuracy" value={summary?.accuracy || "0%"} change="" isPositive={true} accent="#00d2ff" />
        <StatCard label="Time Spent" value={summary?.timeSpent || "0h 0m"} change="" isPositive={false} accent="#94a3b8" />
        <StatCard label="Current Streak" value={`${summary?.currentStreak || 0} days`} change="" isPositive={true} accent="#ffd600" />
      </div>

      <div className="chart-section">
        <div className="main-chart-card glass-card dashboard-card">
          <div className="chart-header">
            <div>
              <p className="activity-label">// 7-DAY ACTIVITY</p>
              <h4 className="text-xl font-bold">Problems solved vs attempted</h4>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-dim">solved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white-10" />
                <span className="text-xs text-dim">attempted</span>
              </div>
            </div>
          </div>

          <div className="h-350 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activity} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{
                    backgroundColor: '#11141d',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="solved" fill="#00d2ff" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="attempted" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card dashboard-card">
          <p className="activity-label">// TOPIC MIX</p>
          <h4 className="text-xl font-bold mb-8">Distribution</h4>

          <div className="h-250 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topics}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topics.map((entry: TopicItem, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">{topics.length}</span>
              <span className="text-tiny text-dim uppercase font-bold tracking-widest">topics</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {topics.map((topic: TopicItem, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: topic.color }} />
                <span className="text-xs font-medium text-[var(--text-dim)]">{topic.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recent-notes-section">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="activity-label">// LATEST</p>
            <h4 className="text-2xl font-bold">Recent notes</h4>
          </div>
          <button
            onClick={onViewAll}
            className="text-primary text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all cursor-pointer"
          >
            View all <span>→</span>
          </button>
        </div>

        <div className="notes-grid">
          {recentNotes.map((note: NoteData, i: number) => (
            <div
              key={i}
              className="glass-card p-6 flex flex-col justify-between group cursor-pointer"
              onClick={() => onOpenNote(note)}
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-tiny font-bold text-primary tracking-widest uppercase">{note.topic || note.tags?.[0] || 'GENERAL'}</span>
                  <span className={`tag ${note.difficulty?.toLowerCase() === 'easy' ? 'text-accent-green bg-accent-green-10' : 'text-tertiary bg-tertiary-10'}`}>{note.difficulty}</span>
                </div>
                <h5 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">{note.title}</h5>
                <p className="text-sm text-dim mb-6 leading-relaxed line-clamp-2">{note.summary}</p>
                <div className="flex gap-2 mb-8 items-center flex-wrap">
                  {note.tags?.map((tag: string) => <span key={tag} className="text-tiny bg-white-5 px-2 py-1 rounded text-dim font-mono">{tag}</span>)}
                </div>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-border">
                <span className="text-tiny text-dim font-mono">{new Date(note.createdAt).toLocaleDateString()}</span>
                <span className="text-tiny font-bold tracking-widest uppercase group-hover:translate-x-1 transition-transform">read →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
