import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { clsx } from 'clsx';

interface FileUploadProps {
    onFileUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
    const [isDragging, setIsDragging] = React.useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'text/csv') {
            onFileUpload(files[0]);
        } else {
            alert('Please upload a valid CSV file.');
        }
    }, [onFileUpload]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onFileUpload(files[0]);
        }
    }, [onFileUpload]);

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={clsx(
                "w-full max-w-2xl mx-auto p-12 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer",
                isDragging
                    ? "border-primary-500 bg-primary-50 scale-[1.02]"
                    : "border-gray-300 hover:border-primary-400 hover:bg-gray-50 bg-white"
            )}
        >
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className={clsx(
                    "p-4 rounded-full transition-colors",
                    isDragging ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-500"
                )}>
                    <Upload className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                        Upload Attendance CSV
                    </h3>
                    <p className="text-gray-500 mt-1">
                        Drag and drop your weekly report here, or click to browse
                    </p>
                </div>
                <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileInput}
                />
                <label
                    htmlFor="file-upload"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer font-medium shadow-sm hover:shadow-md"
                >
                    Select File
                </label>
                <div className="flex items-center text-xs text-gray-400 mt-4">
                    <FileText className="w-4 h-4 mr-1" />
                    <span>Supports .csv files only</span>
                </div>
            </div>
        </div>
    );
};
