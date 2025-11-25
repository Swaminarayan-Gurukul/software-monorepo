export interface AttendanceRecord {
    empId: string;
    name: string;
    dept: string;
    designation: string;
    date: string; // DD-MM-YYYY
    day: string;
    punchIn: string;
    punchOut: string;
    totalWorkingHours: string;
    totalBreak: string;
    status: string;
}

export interface WeeklyReport {
    startDate: string;
    endDate: string;
    records: AttendanceRecord[];
}

export interface DepartmentStats {
    name: string;
    total: number;
    present: number;
    absent: number;
    halfDay: number;
    leave: number;
}
