import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { variable64 } from './img'; // Asegúrate de que esta variable esté definida
import { Transaction } from '@models/transaction';

(pdfMake as any).vfs = pdfFonts.vfs;

// Definimos el tipo de transacción

const generatePDF = (transactions: Transaction[], reportDate: string) => {
  // Calcular totales
  let totalIngresos = 0;
  let totalGastos = 0;

  transactions.forEach((transaction) => {
    const amount = parseFloat(String(transaction.amount));
    if (transaction.category!.type === 'Ingreso') {
      totalIngresos += amount;
    } else if (transaction.category!.type === 'Gasto') {
      totalGastos += amount;
    }
  });
  const balance = totalIngresos - totalGastos;

  // Crear el cuerpo de la tabla
  const tableBody = [
    [
      { text: 'Nombre', style: 'tableHeader' },
      { text: 'Categoría', style: 'tableHeader' },
      { text: 'Tipo', style: 'tableHeader' },
      { text: 'Fecha', style: 'tableHeader' },
      { text: 'Hora', style: 'tableHeader' },
      { text: 'Monto', style: 'tableHeader' },
    ],
    ...transactions.map((transaction) => [
      transaction.name,
      transaction.category!.name,
      transaction.category!.type,
      transaction.date,
      transaction.time,
      `$ ${parseFloat(String(transaction.amount)).toFixed(2)}`,
    ]),
  ];

  // Definir el contenido del PDF
  const content: any[] = [];

  // Encabezado con logo y título
  content.push({
    columns: [
      { image: variable64.miVar, width: 50, margin: [0, 10, 0, 0] }, // Logo con margen
      {
        stack: [
          { text: 'Finzen App', style: 'header' },
          { text: 'Reporte de Transacciones', style: 'subheader' },
          { text: `Fecha: ${reportDate}`, style: 'dateText' },
        ],
        alignment: 'right',
      },
    ],
    margin: [0, 0, 0, 20], // Espacio debajo del encabezado
  });

  // Código QR
  content.push({
    qr: 'https://fin-zen.vercel.app',
    fit: 80,
    alignment: 'right',
    margin: [0, 0, 0, 20],
  });

  // Tabla de transacciones
  content.push({
    table: {
      headerRows: 1,
      widths: ['*', '*', '*', '*', '*', 60],
      body: tableBody,
    },
    layout: {
      fillColor: (rowIndex: number) => {
        return rowIndex === 0 ? '#e5e7eb' : null; // Fondo gris claro solo para el encabezado (gray-200)
      },
      hLineWidth: () => 1,
      vLineWidth: () => 0,
      hLineColor: () => '#d1d5db', // Líneas horizontales en gris suave (gray-300)
    },
    margin: [0, 0, 0, 20],
  });

  // Resumen de totales con diseño tipo Tailwind
  content.push({
    columns: [
      { text: '', width: '*' }, // Espacio a la izquierda
      {
        stack: [
          {
            text: `Total Ingresos: $ ${totalIngresos.toFixed(2)}`,
            style: 'totalIncome',
          },
          {
            text: `Total Gastos: $ ${totalGastos.toFixed(2)}`,
            style: 'totalExpense',
          },
          {
            text: `Balance: $ ${balance.toFixed(2)}`,
            style: balance >= 0 ? 'totalPositive' : 'totalNegative',
          },
        ],
        alignment: 'right',
      },
    ],
    margin: [0, 0, 0, 20],
  });

  // Definir estilos inspirados en Flowbite/Tailwind
  const styles = {
    header: {
      fontSize: 18,
      bold: true,
      color: '#1f2937', // gray-800
      margin: [0, 0, 0, 4],
    },
    subheader: {
      fontSize: 14,
      bold: true,
      color: '#4b5563', // gray-600
      margin: [0, 0, 0, 4],
    },
    dateText: {
      fontSize: 12,
      color: '#6b7280', // gray-500
    },
    tableHeader: {
      fontSize: 12,
      bold: true,
      color: '#111827', // gray-900
      margin: [0, 4, 0, 4],
    },
    totalIncome: {
      fontSize: 14,
      bold: true,
      color: '#16a34a', // green-600
      margin: [0, 4, 0, 4],
    },
    totalExpense: {
      fontSize: 14,
      bold: true,
      color: '#dc2626', // red-600
      margin: [0, 4, 0, 4],
    },
    totalPositive: {
      fontSize: 14,
      bold: true,
      color: '#16a34a', // green-600
      margin: [0, 4, 0, 4],
    },
    totalNegative: {
      fontSize: 14,
      bold: true,
      color: '#dc2626', // red-600
      margin: [0, 4, 0, 4],
    },
  };

  // Definir el documento
  const docDefinition: any = {
    content,
    styles,
    pageMargins: [40, 40, 40, 40], // Márgenes de página tipo Tailwind (p-10)
    defaultStyle: {
      font: 'Roboto', // Opcional, si agregas la fuente Roboto
    },
  };

  // // Generar y descargar el PDF
  // const today = new Date().toISOString().split('T')[0]; // Fecha actual para el nombre del archivo
  // pdfMake.createPdf(docDefinition).download(`reporte_transacciones_${today}.pdf`);

  // Generar y abrir el PDF
  pdfMake.createPdf(docDefinition).open();
};

export default generatePDF;
