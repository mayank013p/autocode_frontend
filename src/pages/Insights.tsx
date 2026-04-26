import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import { AlertCircle, TrendingUp, Info, Loader2 } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import './Insights.css';

interface InsightData {
  mainInsight: {
    strong: string;
    weak: string;
    text: string;
  };
  focusAreas: Array<{
    topic: string;
    attempts: number;
    accuracy: number;
    advice: string;
  }>;
  nudges: Array<{
    type: 'WARN' | 'INFO' | 'CRITICAL';
    title: string;
    message: string;
  }>;
}

const Insights: React.FC = () => {
  const [data, setData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      try {
        const res = await dashboardService.getInsights();
        setData(res);
      } catch (err) {
        console.error("Failed to load insights", err);
      } finally {
        setLoading(false);
      }
    }
    loadInsights();
  }, []);

  const getNudgeStyles = (type: string) => {
    switch (type) {
      case 'CRITICAL':
        return { color: 'var(--secondary)', bg: 'var(--secondary-10)', icon: <AlertCircle size={24} />, border: 'border-l-secondary' };
      case 'WARN':
        return { color: 'var(--tertiary)', bg: 'var(--tertiary-10)', icon: <AlertCircle size={24} />, border: 'border-l-tertiary' };
      case 'INFO':
      default:
        return { color: 'var(--primary)', bg: 'var(--primary-10)', icon: <Info size={24} />, border: 'border-l-primary' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="animate-in fade-in duration-700">
      <Header
        title="Insights"
        subtitle="// patterns the journal noticed about you"
      />

      <div className="glass-card overflow-hidden mb-12 relative group">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/60 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200"
          alt="Banner"
          className="insights-banner"
        />
        <div className="absolute inset-0 z-20 p-10 flex flex-col justify-center">
          <p className="text-tiny font-bold text-primary tracking-widest uppercase mb-3 flex items-center gap-2">
            <TrendingUp size={12} /> SIGNAL
          </p>
          <h3 className="text-3xl font-bold max-w-2xl leading-tight">
            You're stronger at <span className="text-primary">{data.mainInsight.strong}</span>, <br />
            weaker at <span className="text-secondary">{data.mainInsight.weak}</span>.
          </h3>
          <p className="text-sm text-dim mt-4">{data.mainInsight.text}</p>
        </div>
      </div>

      <div className="mb-12">
        <p className="text-tiny text-dim font-bold tracking-widest uppercase mb-6">// WEAK AREAS</p>
        <h4 className="text-2xl font-bold mb-8">Where to focus next</h4>

        <div className="weak-areas-list">
          {data.focusAreas.map((item, i) => {
            // Normalize accuracy: if it's 0.96, convert to 96
            const displayAccuracy = item.accuracy <= 1 ? Math.round(item.accuracy * 100) : Math.round(item.accuracy);
            
            return (
              <div key={i} className="glass-card weak-area-card">
                <div className="w-1/4">
                  <p className="font-bold">{item.topic}</p>
                  <p className="text-tiny text-dim mt-1">{item.attempts} attempts</p>
                </div>
                <div className="flex-1">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ 
                        width: `${displayAccuracy}%`, 
                        backgroundColor: displayAccuracy < 60 ? 'var(--secondary)' : displayAccuracy < 80 ? 'var(--tertiary)' : 'var(--primary)' 
                      }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right text-xs font-mono text-[var(--text-dim)]">
                  {displayAccuracy}%
                </div>
                <div className="w-1/3 text-xs text-[var(--text-dim)] leading-relaxed italic">
                  {item.advice}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12">
        <p className="text-[10px] text-[var(--text-dim)] font-bold tracking-widest uppercase mb-1">// AI SUGGESTIONS</p>
        <h4 className="text-2xl font-bold mb-8">Tactical nudges</h4>

        <div className="ai-suggestions-grid">
          {data.nudges.map((nudge, i) => {
            const styles = getNudgeStyles(nudge.type);
            return (
              <div key={i} className={`glass-card p-8 border-l-4 ${styles.border}`}>
                <div className="flex justify-between items-start mb-6">
                  <div style={{ backgroundColor: styles.bg, color: styles.color }} className="p-3 rounded-xl">
                    {styles.icon}
                  </div>
                  <span style={{ backgroundColor: styles.bg, color: styles.color }} className="tag">
                    {nudge.type}
                  </span>
                </div>
                <h5 className="text-xl font-bold mb-3">{nudge.title}</h5>
                <p className="text-sm text-dim leading-relaxed">
                  {nudge.message}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Insights;
