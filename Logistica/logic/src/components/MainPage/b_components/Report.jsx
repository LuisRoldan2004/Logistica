import React, { useState } from 'react';

function Report() {
  const [reportData, setReportData] = useState(null);

  const generateReport = () => {
    // Lógica para generar el informe
    const data = {
      // Datos simulados o reales
      title: 'Informe de rutas',
      date: new Date().toLocaleDateString(),
      content: 'Aquí va el contenido del informe...',
    };
    setReportData(data);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Generar Informe</h2>
      <button onClick={generateReport}>Generar Informe</button>
      {reportData && (
        <div style={{ marginTop: '20px' }}>
          <h3>{reportData.title}</h3>
          <p><strong>Fecha:</strong> {reportData.date}</p>
          <p>{reportData.content}</p>
        </div>
      )}
    </div>
  );
}

export default Report;
