import { format } from '@formkit/tempo';
import { variable64 } from './img'; // Asegúrate de que esta variable esté definida
import { TransactionReport } from '@models/transaction';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.vfs;

// Importa Chart.js
import Chart from 'chart.js/auto'; // Usamos 'chart.js/auto' para incluir todos los controladores necesarios
// ¡NUEVO! Importa y registra el plugin de datalabels
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registra el plugin globalmente con Chart.js
Chart.register(ChartDataLabels);


interface CategoryTotal {
  name: string;
  total: number;
  percentage: number;
  color: string;
}

// Paleta de colores mejorada con tonos más armoniosos
const CHART_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#14b8a6', // teal-500
  '#ec4899', // pink-500
  '#84cc16', // lime-500
  '#a855f7', // purple-500
  '#64748b', // slate-500
];

/**
 * Genera un gráfico circular usando Chart.js y lo convierte a una imagen Base64.
 * @param categories Datos de las categorías para el gráfico.
 * @param title Título del gráfico.
 * @returns Promesa que resuelve con la imagen Base64 del gráfico.
 */
async function generatePieChartImage(
  categories: CategoryTotal[],
  title: string
): Promise<string> {
  // Si no hay categorías, retornamos una imagen SVG de "no hay datos"
  // Esta parte ya la tenías y es correcta para cuando no hay datos
  if (!categories || categories.length === 0) {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="150" fill="#f8fafc"/>
        <text x="200" y="75" font-size="16" font-weight="bold" text-anchor="middle">No hay datos disponibles para ${title}</text>
      </svg>
    `)}`;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 400; // Ancho deseado para el gráfico
  canvas.height = 300; // Alto deseado para el gráfico

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas.');
  }

  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }

  const data = {
    labels: categories.map((cat) => cat.name),
    datasets: [
      {
        data: categories.map((cat) => cat.total),
        backgroundColor: categories.map((cat) => cat.color),
        hoverOffset: 4,
      },
    ],
  };

  const config: any = {
    type: 'pie',
    data: data,
    options: {
      responsive: false, // Deshabilitar responsividad para captura de imagen fija
      animation: false, // Deshabilitar animaciones para una captura instantánea
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 18,
            weight: 'bold',
            family: 'Helvetica',
          },
          color: '#334155',
        },
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 12,
              family: 'Helvetica',
            },
            color: '#4b5563',
            boxWidth: 15,
            padding: 10,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed !== null) {
                const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
                const value = context.parsed;
                const percentage = total > 0 ? (value / total * 100) : 0;
                label += `$ ${value.toFixed(2)} (${percentage.toFixed(1)}%)`;
              }
              return label;
            },
          },
        },
        datalabels: {
            color: '#fff',
            formatter: (value: any, context: any) => {
                const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
                const percentage = total > 0 ? (value / total * 100) : 0;
                return percentage.toFixed(1) + '%';
            },
            font: {
                weight: 'bold',
                size: 12,
            },
            anchor: 'end',
            align: 'start',
            offset: 10,
            clamp: true,
            display: function(context: any) {
                const dataset = context.dataset;
                const total = dataset.data.reduce((sum: number, val: number) => sum + val, 0);
                const value = dataset.data[context.dataIndex];
                const percentage = total > 0 ? (value / total * 100) : 0;
                return percentage > 5;
            }
        }
      },
      layout: {
        padding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        },
      },
    },
  };

  const chart = new Chart(ctx, config);

  await chart.update('none'); 

  const imageData = canvas.toDataURL('image/png');

  chart.destroy();

  return imageData;
}

export const generatePDFService = async ( 
  transactions: TransactionReport[],
  reportDate: string,
  singleDate?: string,
  fromDate?: string,
  toDate?: string,
  generatedBy?: string
) => {
  let totalIngresos = 0;
  let totalGastos = 0;

  let dateSectionTitle = '';
  if (singleDate) {
    dateSectionTitle = `Fecha: ${singleDate}`;
  } else if (fromDate && toDate) {
    dateSectionTitle = `Del ${fromDate} al ${toDate}`;
  } else if (reportDate) {
    dateSectionTitle = `Reporte del ${reportDate}`;
  } else {
    dateSectionTitle = 'Reporte';
  }

  const filteredTransactions = singleDate
    ? transactions.filter((t) => t.date === singleDate)
    : transactions;

  const gastosPorCategoria: Record<string, number> = {};
  const ingresosPorCategoria: Record<string, number> = {};

  filteredTransactions.forEach((transaction) => {
    const amount = parseFloat(String(transaction.amount));
    const categoryName = transaction.category.name;

    if (transaction.category.type === 'Ingreso') {
      totalIngresos += amount;
      ingresosPorCategoria[categoryName] =
        (ingresosPorCategoria[categoryName] || 0) + amount;
    } else if (transaction.category.type === 'Gasto') {
      totalGastos += amount;
      gastosPorCategoria[categoryName] =
        (gastosPorCategoria[categoryName] || 0) + amount;
    }
  });
  const balance = totalIngresos - totalGastos;

  const gastosArray: CategoryTotal[] = Object.entries(gastosPorCategoria).map(
    ([name, total], index) => ({
      name,
      total,
      percentage: (total / totalGastos) * 100 || 0,
      color: CHART_COLORS[index % CHART_COLORS.length],
    })
  );

  const ingresosArray: CategoryTotal[] = Object.entries(
    ingresosPorCategoria
  ).map(([name, total], index) => ({
    name,
    total,
    percentage: (total / totalIngresos) * 100 || 0,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  // Generar imágenes Base64 para los gráficos. 
  // Siempre generamos la imagen, generatePieChartImage se encarga del SVG de "no data".
  const gastosPieChartImage = await generatePieChartImage(
    gastosArray, // Pasamos el array completo, incluso si está vacío
    'Distribución de Gastos'
  );
  const ingresosPieChartImage = await generatePieChartImage(
    ingresosArray, // Pasamos el array completo, incluso si está vacío
    'Distribución de Ingresos'
  );

  console.log('Gastos Chart Image:', gastosPieChartImage.substring(0, 50) + '...');
  console.log('Ingresos Chart Image:', ingresosPieChartImage.substring(0, 50) + '...');
  console.log('Total Ingresos:', totalIngresos);
  console.log('Total Gastos:', totalGastos);

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
      transaction.category.name,
      transaction.category.type,
      transaction.date,
      transaction.time,
      `$ ${parseFloat(String(transaction.amount)).toFixed(2)}`,
    ]),
  ];

  const content: any[] = [];

  content.push({
    stack: [
      {
        columns: [
          { image: variable64.miVar, width: 50, margin: [0, 5, 20, 0] },
          {
            stack: [
              {
                text: [
                  { text: 'Finzen', style: 'finzenBrand' },
                  { text: 'App', style: 'finzenBrand' },
                ],
                alignment: 'left',
                margin: [0, 0, 0, 5],
              },
              {
                text: 'Movimientos Transaccionales',
                style: 'subheader',
                alignment: 'left',
              },
            ],
            width: '*',
          },
        ],
      },
      {
        stack: [
          {
            text: [
              { text: 'Generado el: ', style: 'dateText' },
              { text: format(reportDate, 'long', 'es'), style: 'dateTextBold' },
              { text: ', por ', style: 'dateText' },
              { text: generatedBy || 'Usuario', style: 'dateTextBold' },
            ],
            margin: [0, 25, 0, 0],
          },
          ...(singleDate
            ? [
                {
                  text: [
                    {
                      text: 'En atención a su requerimiento, adjuntamos detalles de las transacciones\ncorrespondiente a la fecha: ',
                      style: 'reportMessage',
                    },
                    { text: format(singleDate, 'long', 'es'), style: 'dateHighlight' },
                  ],
                  margin: [0, 5, 0, 0],
                },
              ]
            : []),
          ...(!singleDate && fromDate && toDate
            ? [
                {
                  text: [
                    {
                      text: 'En atención a su requerimiento, adjuntamos detalles de las transacciones\ncorrespondiente del: ',
                      style: 'reportMessage',
                    },
                    { text: format(fromDate, 'long', 'es'), style: 'dateHighlight' },
                    { text: ' al ', style: 'reportMessage' },
                    { text: format(toDate, 'long', 'es'), style: 'dateHighlight' },
                  ],
                  margin: [0, 5, 0, 0],
                },
              ]
            : []),
        ],
      },
    ],
    margin: [0, 0, 0, 20],
  });

  content.push({
    table: {
      headerRows: 1,
      widths: ['*', '*', '*', '*', '*', 60],
      body: tableBody,
    },
    layout: {
      fillColor: (rowIndex: number) => {
        return rowIndex === 0 ? '#e5e7eb' : null;
      },
      hLineWidth: () => 1,
      vLineWidth: () => 0,
      hLineColor: () => '#d1d5db',
    },
    margin: [0, 0, 0, 20],
  });

  content.push({
    columns: [
      { text: '', width: '*' },
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

  content.push({
    text: '',
    pageBreak: 'before',
  });

  content.push({
    stack: [
      { text: 'Reporte Visual de Transacciones', style: 'analysisHeader' },
      {
        text: `Periodo: ${
          fromDate ? `${format(fromDate, 'long', 'es')} - ${format(toDate || reportDate, 'long', 'es')}` : format(reportDate, 'long', 'es')
        }`,
        style: 'dateText',
      },
    ],
    margin: [0, 0, 0, 30],
  });

  content.push({
    columns: [
      {
        stack: [
          { text: 'Total Ingresos', style: 'cardTitle' },
          { text: `$ ${totalIngresos.toFixed(2)}`, style: 'cardValue' },
        ],
        alignment: 'center',
        margin: [0, 0, 5, 0],
        background: '#f0fdf4',
        borderRadius: 5,
        padding: 10,
      },
      {
        stack: [
          { text: 'Total Gastos', style: 'cardTitle' },
          { text: `$ ${totalGastos.toFixed(2)}`, style: 'cardValue' },
        ],
        alignment: 'center',
        margin: [5, 0, 5, 0],
        background: '#fef2f2',
        borderRadius: 5,
        padding: 10,
      },
      {
        stack: [
          { text: 'Balance', style: 'cardTitle' },
          {
            text: `$ ${balance.toFixed(2)}`,
            style: balance >= 0 ? 'positiveCardValue' : 'negativeCardValue',
          },
        ],
        alignment: 'center',
        margin: [5, 0, 0, 0],
        background: balance >= 0 ? '#f0fdf4' : '#fef2f2',
        borderRadius: 5,
        padding: 10,
      },
    ],
    margin: [0, 0, 0, 30],
  });

  // --- Sección de Gráficos Condicionales ---
  // Solo añadir la sección de "Distribución por Categorías" si hay al menos un gráfico
  const hasTransactions = totalGastos > 0 || totalIngresos > 0;
  if (hasTransactions) {
    content.push({
      text: 'Distribución por Categorías',
      style: 'sectionHeader',
      margin: [0, 0, 0, 15],
    });

    // Solo crear y mostrar el gráfico de gastos si hay gastos
    if (totalGastos > 0) {
      const gastosPieChartImage = await generatePieChartImage(
        gastosArray,
        'Distribución de Gastos'
      );
      content.push({
        image: gastosPieChartImage,
        width: 400,
        alignment: 'center',
        margin: [0, 0, 0, 20],
      });
    }

    // Solo crear y mostrar el gráfico de ingresos si hay ingresos
    if (totalIngresos > 0) {
      const ingresosPieChartImage = await generatePieChartImage(
        ingresosArray,
        'Distribución de Ingresos'
      );
      content.push({
        image: ingresosPieChartImage,
        width: 400,
        alignment: 'center',
        margin: [0, 0, 0, 20],
      });
    }
  }
  // --- Fin de Sección de Gráficos Condicionales ---

  const styles = {
    header: {
      fontSize: 24,
      bold: true,
      color: '#1f2937',
      margin: [0, 0, 0, 4],
    },
    finzenBrand: {
      fontSize: 24,
      bold: true,
      color: '#3b82f6',
    },
    appText: {
      fontSize: 24,
      bold: true,
      color: '#111827',
    },
    subheader: {
      fontSize: 18,
      bold: true,
      color: '#4b5563',
      margin: [0, 0, 0, 4],
    },
    dateText: {
      fontSize: 12,
      color: '#6b7280',
    },
    dateTextBold: {
      fontSize: 12,
      bold: true,
      color: '#4b5563',
    },
    dateHighlight: {
      fontSize: 12,
      bold: true,
      color: '#3b82f6',
      lineHeight: 1.4,
    },
    reportMessage: {
      fontSize: 12,
      color: '#4b5563',
      lineHeight: 1.4,
    },
    generatedByLabel: {
      fontSize: 12,
      color: '#6b7280',
    },
    generatedByName: {
      fontSize: 12,
      bold: true,
      color: '#111827',
    },
    tableHeader: {
      fontSize: 12,
      bold: true,
      color: '#111827',
      margin: [0, 4, 0, 4],
    },
    totalIncome: {
      fontSize: 14,
      bold: true,
      color: '#16a34a',
      margin: [0, 4, 0, 4],
    },
    totalExpense: {
      fontSize: 14,
      bold: true,
      color: '#dc2626',
      margin: [0, 4, 0, 4],
    },
    totalPositive: {
      fontSize: 14,
      bold: true,
      color: '#16a34a',
      margin: [0, 4, 0, 4],
    },
    totalNegative: {
      fontSize: 14,
      bold: true,
      color: '#dc2626',
      margin: [0, 4, 0, 4],
    },
    analysisHeader: {
      fontSize: 24,
      bold: true,
      color: '#334155',
      margin: [0, 0, 0, 5],
    },
    sectionHeader: {
      fontSize: 16,
      bold: true,
      color: '#1f2937',
      margin: [0, 0, 0, 8],
    },
    cardTitle: {
      fontSize: 14,
      color: '#4b5563',
      margin: [0, 0, 0, 5],
    },
    cardValue: {
      fontSize: 18,
      bold: true,
      color: '#111827',
    },
    positiveCardValue: {
      fontSize: 18,
      bold: true,
      color: '#16a34a',
    },
    negativeCardValue: {
      fontSize: 18,
      bold: true,
      color: '#dc2626',
    },
    footer: {
      fontSize: 10,
      italic: true,
      color: '#6b7280',
    },
  };

  const docDefinition: any = {
    content,
    styles,
    pageMargins: [40, 40, 40, 40],
    defaultStyle: {
      font: 'Roboto',
    },
    footer: function (currentPage: number, pageCount: number) {
      return {
        text: `Página ${currentPage} de ${pageCount}`,
        alignment: 'right',
        margin: [0, 0, 40, 0],
        fontSize: 8,
        color: '#9ca3af',
      };
    },
  };

  const today = new Date().toISOString().split('T')[0];
  pdfMake
    .createPdf(docDefinition)
    .download(`reporte_transacciones_${reportDate}.pdf`);
};

export default generatePDFService;