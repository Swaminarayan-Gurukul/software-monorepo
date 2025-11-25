import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { AttendanceRecord } from '../../types/attendance';

interface DepartmentChartProps {
    data: AttendanceRecord[];
}

export const DepartmentChart: React.FC<DepartmentChartProps> = ({ data }) => {
    // Aggregate data by department
    const deptStats = React.useMemo(() => {
        const stats: Record<string, { name: string; present: number; absent: number }> = {};

        data.forEach(record => {
            if (!stats[record.dept]) {
                stats[record.dept] = { name: record.dept, present: 0, absent: 0 };
            }
            if (record.status === 'Present' || record.status === 'Half Day') {
                stats[record.dept].present += 1;
            } else {
                stats[record.dept].absent += 1;
            }
        });

        return Object.values(stats).sort((a, b) => b.present - a.present); // Sort by most present
    }, [data]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance by Department</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={deptStats}
                    margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={60}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="present" name="Present" fill="#f97316" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" name="Absent" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
