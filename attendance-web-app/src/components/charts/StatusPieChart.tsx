import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { AttendanceRecord } from '../../types/attendance';

interface StatusPieChartProps {
    data: AttendanceRecord[];
}

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ data }) => {
    const statusData = React.useMemo(() => {
        const stats: Record<string, number> = {};
        data.forEach(record => {
            const status = record.status || 'Unknown';
            stats[status] = (stats[status] || 0) + 1;
        });

        return Object.entries(stats).map(([name, value]) => ({ name, value }));
    }, [data]);

    const COLORS = ['#f97316', '#ef4444', '#f59e0b', '#3b82f6', '#9ca3af'];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Status Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
