import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelViewer: React.FC = () => {
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [sheetsData, setSheetsData] = useState<Record<string, any[][]>>({});
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<any[] | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result as string;
      const wb = XLSX.read(bstr, { type: 'binary' });

      const newSheetsData: Record<string, any[][]> = {};
      wb.SheetNames.forEach((name) => {
        const ws = wb.Sheets[name];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        newSheetsData[name] = data;
      });

      setSheetNames(wb.SheetNames);
      setSheetsData(newSheetsData);
      setSelectedSheet(wb.SheetNames[0]); // default to first sheet
      setSelectedRow(null);
    };
    reader.readAsBinaryString(file);
  };

  const currentSheetData = selectedSheet ? sheetsData[selectedSheet] : [];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Excel Viewer</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {sheetNames.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Sheets</h3>
          {sheetNames.map((name) => (
            <button
              key={name}
              onClick={() => {
                setSelectedSheet(name);
                setSelectedRow(null);
              }}
              style={{
                marginRight: '10px',
                padding: '5px 10px',
                backgroundColor: selectedSheet === name ? '#007acc' : '#f0f0f0',
                color: selectedSheet === name ? 'white' : 'black',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {currentSheetData.length > 0 && (
        <>
          <table border={1} cellPadding={10} style={{ marginTop: '20px', width: '100%' }}>
            <thead>
              <tr>
                {currentSheetData[0].map((cell, i) => (
                  <th key={i}>{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentSheetData.slice(1).map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => setSelectedRow(row)}
                  style={{ cursor: 'pointer' }}
                >
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {selectedRow && (
            <div style={{ marginTop: '60px', borderTop: '2px solid #ccc', paddingTop: '20px' }}>
              <h3>Selected Row from "{selectedSheet}"</h3>
              <table border={1} cellPadding={10}>
                <thead>
                  <tr>
                    {currentSheetData[0].map((header, i) => (
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
