import React, { useState } from 'react';
import type { AttendanceRecord } from '../types/attendance';
import { getUniqueDepartments } from '../utils/csvParser';
import clsx from 'clsx';

interface ReportViewProps {
    data: AttendanceRecord[];
}

export const ReportView: React.FC<ReportViewProps> = ({ data }) => {
    const [selectedDept, setSelectedDept] = useState<string>('All');
    const departments = React.useMemo(() => ['All', ...getUniqueDepartments(data)], [data]);

    const filteredData = React.useMemo(() => {
        if (selectedDept === 'All') return data;
        return data.filter(r => r.dept === selectedDept);
    }, [data, selectedDept]);

    // Group by Employee
    const groupedData = React.useMemo(() => {
        const groups: Record<string, AttendanceRecord[]> = {};
        filteredData.forEach(record => {
            if (!groups[record.empId]) {
                groups[record.empId] = [];
            }
            groups[record.empId].push(record);
        });
        return groups;
    }, [filteredData]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 print:hidden">
                <h3 className="text-lg font-semibold text-gray-900">Detailed Attendance Report</h3>
                <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                    {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3">Emp ID</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Dept</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Day</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">In / Out</th>
                            <th className="px-6 py-3">Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedData).map(([empId, records]) => (
                            <React.Fragment key={empId}>
                                {records.map((record, index) => (
                                    <tr
                                        key={`${empId}-${record.date}`}
                                        className={clsx(
                                            "border-b hover:bg-gray-50 transition-colors",
                                            record.status === 'Absent' ? "bg-red-50/50" : ""
                                        )}
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">{index === 0 ? record.empId : ''}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{index === 0 ? record.name : ''}</td>
                                        <td className="px-6 py-4 text-gray-500">{record.dept}</td>
                                        <td className="px-6 py-4 text-gray-500">{record.date}</td>
                                        <td className="px-6 py-4 text-gray-500">{record.day}</td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "px-2 py-1 rounded-full text-xs font-semibold",
                                                record.status === 'Present' ? "bg-green-100 text-green-700" :
                                                    record.status === 'Absent' ? "bg-red-100 text-red-700" :
                                                        "bg-orange-100 text-orange-700"
                                            )}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {record.punchIn} - {record.punchOut}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{record.totalWorkingHours}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
