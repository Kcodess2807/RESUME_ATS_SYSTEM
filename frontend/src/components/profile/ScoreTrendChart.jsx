import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Activity } from 'lucide-react'
import Card from '../ui/Card'

function ScoreTrendChart({ data }) {
    // Sort the history by date so the chart flows from oldest to newest
    const sortedData = [...data].sort((a, b) => new Date(a.date || a.created_at || 0) - new Date(b.date || b.created_at || 0))

    // Custom Tooltip component for Recharts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface/95 backdrop-blur-md p-4 border border-secondary-100 shadow-sm rounded-xl">
                    <p className="font-bold text-secondary-800 mb-1">{label}</p>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-accent-500"></span>
                        <p className="text-sm font-semibold text-secondary-600">
                            ATS Score: <span className="text-accent-600 font-extrabold text-lg ml-1">{payload[0].value}</span>
                        </p>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <Card className="p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary-500" />
                        Score Improvement Trend
                    </h2>
                    <p className="text-secondary-500 text-sm mt-1">
                        Track your ATS score progress over time.
                    </p>
                </div>

                <div className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary-100/50">
                    Analytics
                </div>
            </div>

            <div className="flex-grow min-h-[300px] w-full mt-4">
                {sortedData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={sortedData}
                            margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
                        >
                            {/* Soft horizontal grids */}
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                domain={[0, 100]}
                            />

                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />

                            {/* The glowing line */}
                            <Line
                                type="monotone"
                                dataKey="ats_score"
                                stroke="url(#colorUv)"
                                strokeWidth={4}
                                dot={{ r: 6, strokeWidth: 3, fill: '#fff', stroke: '#10b981' }}
                                activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 4, fill: '#fff' }}
                                animationDuration={1500}
                            />

                            {/* Define cool gradient for the line */}
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#2563eb" /> {/* Blue */}
                                    <stop offset="50%" stopColor="#0ea5e9" /> {/* Sky */}
                                    <stop offset="100%" stopColor="#10b981" /> {/* Emerald */}
                                </linearGradient>
                            </defs>
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-secondary-400">
                        <Activity className="w-12 h-12 mb-3 text-secondary-200" />
                        <p>No analysis history yet.</p>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default ScoreTrendChart
