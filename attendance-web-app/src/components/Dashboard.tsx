import React from 'react';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import type { AttendanceRecord } from '../types/attendance';
import { StatsCard } from './StatsCard';
import { DepartmentChart } from './charts/DepartmentChart';
import { StatusPieChart } from './charts/StatusPieChart';
import { DailyTrendChart } from './charts/DailyTrendChart';
import { getWeekRange } from '../utils/csvParser';

interface DashboardProps {
    data: AttendanceRecord[];
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    const stats = React.useMemo(() => {
        const total = data.length;
        const present = data.filter(r => r.status === 'Present' || r.status === 'Half Day').length;
        const absent = data.filter(r => r.status === 'Absent').length;
        const halfDay = data.filter(r => r.status === 'Half Day').length;

        return { total, present, absent, halfDay };
    }, [data]);

    const weekRange = React.useMemo(() => getWeekRange(data), [data]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Weekly Overview</h2>
                    <p className="text-gray-500 mt-1">
                        Report for {weekRange.start} - {weekRange.end}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Records"
                    value={stats.total}
                    icon={Users}
                    color="blue"
                />
                <StatsCard
                    title="Present"
                    value={stats.present}
                    icon={UserCheck}
                    color="green"
                />
                <StatsCard
                    title="Absent"
                    value={stats.absent}
                    icon={UserX}
                    color="red"
                />
                <StatsCard
                    title="Half Day"
                    value={stats.halfDay}
                    icon={Clock}
                    color="orange"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DepartmentChart data={data} />
                <StatusPieChart data={data} />
            </div>

            <DailyTrendChart data={data} />
        </div>
    );
};
