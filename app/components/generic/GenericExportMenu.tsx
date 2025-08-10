import { Download, FileSpreadsheet, FileText, Printer } from 'lucide-react';

interface ExportOption {
  type: 'csv' | 'excel' | 'pdf' | 'print';
  label: string;
  icon: React.ReactNode;
  handler: () => void;
}

interface GenericExportMenuProps<T> {
  data: T[];
  filename?: string;
  className?: string;
  // Customizable options
  columns?: { key: keyof T | string; label: string }[];
  // Customizable text
  exportText?: string;
  csvLabel?: string;
  excelLabel?: string;
  pdfLabel?: string;
  printLabel?: string;
  // Custom handlers (optional)
  onCustomExport?: {
    csv?: () => void;
    excel?: () => void;
    pdf?: () => void;
    print?: () => void;
  };
}

export function GenericExportMenu<T extends Record<string, any>>({ 
  data, 
  filename = 'export',
  className = "",
  columns,
  exportText = "Export",
  csvLabel = "Export CSV", 
  excelLabel = "Export Excel",
  pdfLabel = "Export Text",
  printLabel = "Print",
  onCustomExport
}: GenericExportMenuProps<T>) {
  
  // Get headers and keys to export
  const getExportData = () => {
    if (columns) {
      return {
        headers: columns.map(col => col.label),
        keys: columns.map(col => col.key)
      };
    } else if (data.length > 0) {
      const keys = Object.keys(data[0]);
      return {
        headers: keys,
        keys: keys
      };
    }
    return { headers: [], keys: [] };
  };

  // Convert data to CSV
  const exportToCSV = () => {
    if (onCustomExport?.csv) {
      onCustomExport.csv();
      return;
    }

    if (data.length === 0) return;
    
    const { headers, keys } = getExportData();
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        keys.map(key => {
          const value = typeof key === 'string' && key.includes('.') 
            ? key.split('.').reduce((obj: any, k: string) => obj?.[k], row)
            : row[key];
          
          // Handle different data types
          if (value === null || value === undefined) return '';
          if (value instanceof Date) return value.toISOString().split('T')[0];
          if (typeof value === 'object') return JSON.stringify(value);
          // Escape commas and quotes
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export to Excel (using CSV format with .xls extension)
  const exportToExcel = () => {
    if (onCustomExport?.excel) {
      onCustomExport.excel();
      return;
    }

    if (data.length === 0) return;
    
    const { headers, keys } = getExportData();
    const excelContent = [
      headers.join('\t'),
      ...data.map(row => 
        keys.map(key => {
          const value = typeof key === 'string' && key.includes('.') 
            ? key.split('.').reduce((obj: any, k: string) => obj?.[k], row)
            : row[key];
          
          if (value === null || value === undefined) return '';
          if (value instanceof Date) return value.toISOString().split('T')[0];
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        }).join('\t')
      )
    ].join('\n');
    
    const blob = new Blob([excelContent], { 
      type: 'application/vnd.ms-excel;charset=utf-8;' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Print table
  const printTable = () => {
    if (onCustomExport?.print) {
      onCustomExport.print();
      return;
    }

    if (data.length === 0) return;
    
    const { headers, keys } = getExportData();
    const tableHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .header { margin-bottom: 20px; }
            .header h1 { margin: 0; color: #333; }
            .header p { margin: 5px 0 0 0; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${filename}</h1>
            <p>Exported on ${new Date().toLocaleDateString()}</p>
            <p>Total records: ${data.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${keys.map(key => {
                    const value = typeof key === 'string' && key.includes('.') 
                      ? key.split('.').reduce((obj: any, k: string) => obj?.[k], row)
                      : row[key];
                    
                    let displayValue = '';
                    if (value === null || value === undefined) displayValue = '';
                    else if (value instanceof Date) displayValue = value.toLocaleDateString();
                    else if (typeof value === 'object') displayValue = JSON.stringify(value);
                    else displayValue = String(value);
                    return `<td>${displayValue}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(tableHTML);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  // Export to PDF (simplified - creates a formatted text file)
  const exportToPDF = () => {
    if (onCustomExport?.pdf) {
      onCustomExport.pdf();
      return;
    }

    if (data.length === 0) return;
    
    const { headers, keys } = getExportData();
    const textContent = [
      `${filename.toUpperCase()}`,
      `Exported on: ${new Date().toLocaleDateString()}`,
      `Total records: ${data.length}`,
      '',
      headers.join(' | '),
      '-'.repeat(headers.join(' | ').length),
      ...data.map(row => 
        keys.map(key => {
          const value = typeof key === 'string' && key.includes('.') 
            ? key.split('.').reduce((obj: any, k: string) => obj?.[k], row)
            : row[key];
          
          if (value === null || value === undefined) return '';
          if (value instanceof Date) return value.toLocaleDateString();
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        }).join(' | ')
      )
    ].join('\n');
    
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportOptions: ExportOption[] = [
    {
      type: 'csv',
      label: csvLabel,
      icon: <FileSpreadsheet className="h-4 w-4" />,
      handler: exportToCSV
    },
    {
      type: 'excel',
      label: excelLabel,
      icon: <FileSpreadsheet className="h-4 w-4" />,
      handler: exportToExcel
    },
    {
      type: 'pdf',
      label: pdfLabel,
      icon: <FileText className="h-4 w-4" />,
      handler: exportToPDF
    },
    {
      type: 'print',
      label: printLabel,
      icon: <Printer className="h-4 w-4" />,
      handler: printTable
    }
  ];

  return (
    <div className={`relative group ${className}`}>
      <button className="h-[40px] inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <Download className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">{exportText}</span>
      </button>
      
      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {exportOptions.map((option) => (
            <button
              key={option.type}
              onClick={option.handler}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {option.icon}
              <span className="ml-3">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
