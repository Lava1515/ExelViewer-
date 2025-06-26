import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelViewer: React.FC = () => {
  const [rows, setRows] = useState<any[][]>([]);
  const [selectedRow, setSelectedRow] = useState<any[] | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result as string;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
      setRows(data);
      setSelectedRow(null);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Excel Viewer</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {rows.length > 0 && (
        <>
          <table border={1} cellPadding={10} style={{ marginTop: '20px', width: '100%' }}>
            <thead>
              <tr>
                {rows[0].map((cell, i) => (
                  <th key={i}>{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => setSelectedRow(row)}
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {selectedRow && (
            <div style={{ marginTop: '120px' }}>
              <h3>Selected Row</h3>
              <table border={1} cellPadding={10}>
                <thead>
                  <tr>
                    {rows[0].map((header, i) => (
                      <th key={i}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {selectedRow.map((cell, i) => (
                      <td key={i}>{cell}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExcelViewer;
