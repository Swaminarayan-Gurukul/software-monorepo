import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AttendanceRecord } from '../../types/attendance';
import { format, parse } from 'date-fns';

interface DailyTrendChartProps {
    data: AttendanceRecord[];
}

export const DailyTrendChart: React.FC<DailyTrendChartProps> = ({ data }) => {
    const trendData = React.useMemo(() => {
        const stats: Record<string, { date: string; present: number; absent: number }> = {};

        data.forEach(record => {
            // Date format is DD-MM-YYYY
            if (!stats[record.date]) {
                stats[record.date] = { date: record.date, present: 0, absent: 0 };
            }
            if (record.status === 'Present' || record.status === 'Half Day') {
                stats[record.date].present += 1;
            } else {
                stats[record.date].absent += 1;
            }
        });

        return Object.values(stats).sort((a, b) => {
            const dateA = parse(a.date, 'dd-MM-yyyy', new Date());
            const dateB = parse(b.date, 'dd-MM-yyyy', new Date());
            return dateA.getTime() - dateB.getTime();
        });
    }, [data]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Attendance Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="present" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Present" />
                    <Line type="monotone" dataKey="absent" stroke="#e5e7eb" strokeWidth={3} dot={{ r: 4 }} name="Absent" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
