import Papa from 'papaparse';
import type { AttendanceRecord } from '../types/attendance';

export const parseCSV = (file: File): Promise<AttendanceRecord[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsedData: AttendanceRecord[] = results.data.map((row: any) => ({
                    empId: row['Emp Id'] || '',
                    name: row['Name'] || '',
                    dept: row['Dept.'] || '',
                    designation: row['Designation'] || '',
                    date: row['Date'] || '',
                    day: row['Day'] || '',
                    punchIn: row['Punch In'] || '-',
                    punchOut: row['Punch Out'] || '-',
                    totalWorkingHours: row['Total Working Hours'] || '-',
                    totalBreak: row['Total Break'] || '-',
                    status: row['Status'] || 'Absent',
                })).filter(record => record.empId && record.date); // Filter out invalid rows

                resolve(parsedData);
            },
            error: (error) => {
                reject(error);
            },
        });
    });
};

export const getUniqueDepartments = (records: AttendanceRecord[]): string[] => {
    return Array.from(new Set(records.map(r => r.dept))).sort();
};

export const getWeekRange = (records: AttendanceRecord[]) => {
    if (records.length === 0) return { start: '', end: '' };

    // Assuming records are sorted or we find min/max
    // Dates are DD-MM-YYYY
    const parseDate = (d: string) => {
        const [day, month, year] = d.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const dates = records.map(r => parseDate(r.date).getTime());
    const min = new Date(Math.min(...dates));
    const max = new Date(Math.max(...dates));

    return {
        start: min.toLocaleDateString('en-GB'),
        end: max.toLocaleDateString('en-GB')
    };
};
