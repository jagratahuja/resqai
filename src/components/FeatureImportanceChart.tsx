import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ModelMetrics } from '../types';

export function FeatureImportanceChart({ metrics }: { metrics?: ModelMetrics }) {
  if (!metrics) return null;

  // Take top 5 features
  const data = metrics.feature_importance.slice(0, 5).map(f => ({
    name: f.Feature.replace('incident_type_', '').replace('weather_', ''),
    importance: Math.round(f.Importance * 100)
  }));

  return (
    <div className="card p-5 h-[320px] flex flex-col">
      <h3 className="font-semibold text-white mb-6">Key Predictive Features</h3>
      <div className="flex-1 w-full" style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 12, fontFamily: 'Inter' }} 
              width={100} 
            />
            <Tooltip 
              cursor={{ fill: '#27272a', opacity: 0.4 }}
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#e4e4e7', fontFamily: 'Inter', fontSize: '12px' }}
              itemStyle={{ color: '#3b82f6', fontWeight: 600 }}
              formatter={(value: number) => [`${value}%`, 'Importance']}
            />
            <Bar dataKey="importance" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill="#3b82f6" fillOpacity={1 - index * 0.15} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
