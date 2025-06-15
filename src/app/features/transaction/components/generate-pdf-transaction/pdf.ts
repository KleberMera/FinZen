import { format } from '@formkit/tempo';
import { variable64 } from './img'; // Asegúrate de que esta variable esté definida
import { TransactionReport } from '@models/transaction';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.vfs;
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

// Función para generar un gráfico circular SVG con diseño mejorado
function generatePieChartSVG(
  categories: CategoryTotal[],
  title: string
): string {
  if (!categories || categories.length === 0) {
    return `
      <svg width="400" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="150" fill="#f8fafc"/>
        <text x="200" y="75" font-size="16" font-weight="bold" text-anchor="middle">No hay datos disponibles para ${title}</text>
      </svg>
    `;
  }

  const width = 400;
  const height = 375;
  const radius = 85;
  const centerX = width / 2;
  const centerY = 130;

  let startAngle = 0;
  let slices = '';
  let legend = '';

  const defs = `
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="3" dy="3" stdDeviation="3" flood-opacity="0.2"/>
      </filter>
      <linearGradient id="backgroundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f8fafc"/>
        <stop offset="100%" style="stop-color:#f1f5f9"/>
      </linearGradient>
    </defs>
  `;

  // Crear los segmentos del pie con efecto de separación
  categories.forEach((category, index) => {
    const sliceAngle = (category.percentage / 100) * (2 * Math.PI);
    const endAngle = startAngle + sliceAngle;

    // Añadir un pequeño "desplazamiento" al segmento para resaltarlo
    const midAngle = startAngle + sliceAngle / 2;
    const offset = 3; // Reducido para un aspecto más uniforme
    const offsetX = Math.cos(midAngle) * offset;
    const offsetY = Math.sin(midAngle) * offset;

    // Calcular los puntos del arco
    const x1 = centerX + offsetX + radius * Math.cos(startAngle);
    const y1 = centerY + offsetY + radius * Math.sin(startAngle);
    const x2 = centerX + offsetX + radius * Math.cos(endAngle);
    const y2 = centerY + offsetY + radius * Math.sin(endAngle);

    // Determinar si el arco es mayor que 180 grados (π radianes)
    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

    // Crear el path para el segmento
    const path = `M${centerX + offsetX},${
      centerY + offsetY
    } L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;

    slices += `<path d="${path}" fill="${category.color}" stroke="white" stroke-width="1.5" filter="url(#shadow)"></path>`;

    // Crear la leyenda más elegante con círculos en lugar de rectángulos
    // Comenzar la leyenda después del gráfico con suficiente espacio
    const legendY = 220 + index * 22; // Comienza después del gráfico con espacio uniforme
    legend += `
      <g transform="translate(0, ${legendY})">
        <circle cx="20" cy="0" r="6" fill="${
          category.color
        }" stroke="white" stroke-width="1"></circle>
        <text x="35" y="5" font-size="12" font-family="Helvetica">${
          category.name
        }</text>
        <text x="350" y="5" font-size="12" font-family="Helvetica" text-anchor="end">$ ${category.total.toFixed(
          2
        )} (${category.percentage.toFixed(1)}%)</text>
      </g>
    `;

    startAngle = endAngle;
  });
  const totalAmount = categories.reduce((sum, cat) => sum + cat.total, 0);
  // Ensamblar el SVG completo con fondo mejorado
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${defs}
      <rect width="${width}" height="${height}" fill="url(#backgroundGrad)" rx="10" ry="10"/>
      <text x="${width/2}" y="30" font-size="18" font-weight="bold" text-anchor="middle" font-family="Helvetica" fill="#334155">${title}</text>
      <line x1="50" y1="45" x2="${width-50}" y2="45" stroke="#e2e8f0" stroke-width="2"/>
      
      <g transform="translate(0, 10)">
        ${slices}
        <circle cx="${centerX}" cy="${centerY}" r="42" fill="white" stroke="#e2e8f0" stroke-width="2"/>
        <text x="${centerX}" y="${centerY-10}" font-size="13" text-anchor="middle" font-family="Helvetica" fill="#64748b">Total</text>
        <text x="${centerX}" y="${centerY+15}" font-size="17" font-weight="bold" text-anchor="middle" font-family="Helvetica" fill="#334155">$ ${totalAmount.toFixed(2)}</text>
      </g>
      
      <g transform="translate(10, 0)">
        ${legend}
      </g>
    </svg>
  `;

  return svg;
}

export const generatePDFService = (
  transactions: TransactionReport[],
  reportDate: string,
  singleDate?: string,
  fromDate?: string,
  toDate?: string,
  generatedBy?: string
) => {
  // Calcular totales
  let totalIngresos = 0;
  let totalGastos = 0;

  // Determinar el título de la sección de fechas
  let dateSectionTitle = '';
  if (singleDate) {
    dateSectionTitle = `Fecha: ${singleDate}`;
  } else if (fromDate && toDate) {
    dateSectionTitle = `Del ${fromDate} al ${toDate}`;
  } else if (reportDate) {
    dateSectionTitle = `Reporte del ${reportDate}`;
  } else {
    dateSectionTitle = 'Reporte';
  };

  // Filtrar transacciones según la fecha seleccionada
  const filteredTransactions = singleDate 
    ? transactions.filter(t => t.date === singleDate)
    : transactions;

  // Calcular totales y procesar datos para los gráficos
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

  // Convertir a arrays para los gráficos
  const gastosArray: CategoryTotal[] = Object.entries(gastosPorCategoria).map(
    ([name, total], index) => ({
      name,
      total,
      percentage: (total / totalGastos) * 100,
      color: CHART_COLORS[index % CHART_COLORS.length],
    })
  );

  const ingresosArray: CategoryTotal[] = Object.entries(
    ingresosPorCategoria
  ).map(([name, total], index) => ({
    name,
    total,
    percentage: (total / totalIngresos) * 100,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  // Generar SVGs para los gráficos
  const gastosPieChart = generatePieChartSVG(
    gastosArray,
    'Distribución de Gastos'
  );
  const ingresosPieChart = generatePieChartSVG(
    ingresosArray,
    'Distribución de Ingresos'
  );

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
      transaction.category.name,
      transaction.category.type,
      transaction.date,
      transaction.time,
      `$ ${parseFloat(String(transaction.amount)).toFixed(2)}`,
    ]),
  ];

  // Definir el contenido del PDF

  const content: any[] = [];

  // Primera página - Resumen general y tabla de transacciones
  content.push({
    stack: [
      // Logo y título principal en la primera fila
      {
        columns: [
          { image: variable64.miVar, width: 50, margin: [0, 5, 20, 0] }, // Añadido margen derecho al logo
          {
            stack: [
              { 
                text: [
                  { text: 'Finzen', style: 'finzenBrand' }, 
                  { text: 'App', style: 'finzenBrand' } // Cambiado a finzenBrand para mantener el mismo estilo
                ],
                alignment: 'left',
                margin: [0, 0, 0, 5] // Espacio entre FinzenApp y Movimientos
              },
              { 
                text: 'Movimientos Transaccionales', 
                style: 'subheader',
                alignment: 'left'
              }
            ],
            width: '*'
          }
        ]
      },
      // Información de generación en la segunda fila con más espacio
      {
        stack: [
          { 
            text: [
              { text: 'Generado el: ', style: 'dateText' },
              { text: format(reportDate, 'long', 'es'), style: 'dateTextBold' },
              { text: ', por ', style: 'dateText' },
              { text: generatedBy || 'Usuario', style: 'dateTextBold' }
            ],
            margin: [0, 25, 0, 0] // Aumentado el espacio superior
          },
          ...(singleDate ? [{
            text: [
              { text: 'En atención a su requerimiento, adjuntamos detalles de las transacciones\ncorrespondiente a la fecha: ', style: 'reportMessage' },
              { text: format(singleDate, 'long', 'es'), style: 'dateHighlight' }
            ],
            margin: [0, 5, 0, 0]
          }] : []),
          ...(!singleDate && fromDate && toDate ? [{
            text: [
              { text: 'En atención a su requerimiento, adjuntamos detalles de las transacciones\ncorrespondiente del: ', style: 'reportMessage' },
              { text: format(fromDate, 'long', 'es'), style: 'dateHighlight' },
              { text: ' al ', style: 'reportMessage' },
              { text: format(toDate, 'long', 'es'), style: 'dateHighlight' }
            ],
            margin: [0, 5, 0, 0]
          }] : [])
        ]
      }
    ],
    margin: [0, 0, 0, 20]
  });
  
  // Añadimos el código QR integrado en el encabezado
  // content.push({
  //   qr: 'https://fin-zen.vercel.app',
  //   fit: 80,
  //   alignment: 'right',
  //   margin: [0, -100, 0, 20] // Posicionamiento para que aparezca junto al encabezado
  // });
  
  // Eliminamos el código QR separado ya que ahora está integrado en el encabezado

  // El código QR ahora está integrado en el encabezado

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

  // Añadir un salto de página antes de los gráficos
  content.push({
    text: '',
    pageBreak: 'before',
  });

  // Segunda página - Análisis visual con gráficos
  // Encabezado de la sección de análisis
  content.push({
    stack: [
      { text: 'Reporte Visual de Transacciones', style: 'analysisHeader' },
      { text: `Periodo: ${fromDate ? `${fromDate} - ${toDate || reportDate}` : reportDate}`, style: 'dateText' },
    ],
    margin: [0, 0, 0, 30],
  });

  // Información resumen en diseño tipo tarjeta para la parte superior
  content.push({
    columns: [
      {
        stack: [
          { text: 'Total Ingresos', style: 'cardTitle' },
          { text: `$ ${totalIngresos.toFixed(2)}`, style: 'cardValue' },
        ],
        alignment: 'center',
        margin: [0, 0, 5, 0],
        background: '#f0fdf4', // green-50
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
        background: '#fef2f2', // red-50
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

  // Gráficos circulares
  if (gastosArray.length > 0 || ingresosArray.length > 0) {
    content.push({
      text: 'Distribución por Categorías',
      style: 'sectionHeader',
      margin: [0, 0, 0, 15],
    });
  }

  // Mostrar gráficos circulares
  if (gastosArray.length > 0) {
    content.push({
      svg: gastosPieChart,
      width: 400,
      alignment: 'center',
      margin: [0, 0, 0, 20],
    });
  }

  if (ingresosArray.length > 0) {
    content.push({
      svg: ingresosPieChart,
      width: 400,
      alignment: 'center',
      margin: [0, 0, 0, 20],
    });
  }

  // Pie de página analítico
  // content.push({
  //   text: 'Este reporte proporciona un análisis detallado de sus transacciones financieras. Utilice esta información para tomar decisiones financieras más informadas.',
  //   style: 'footer',
  //   alignment: 'center',
  //   margin: [0, 30, 0, 0],
  // });

  // Definir estilos con mejor UI
  const styles = {
    header: {
      fontSize: 24,
      bold: true,
      color: '#1f2937', // gray-800
      margin: [0, 0, 0, 4],
    },
    finzenBrand: {
      fontSize: 24,
      bold: true,
      color: '#3b82f6', // blue-500
    },
    appText: {
      fontSize: 24,
      bold: true,
      color: '#111827', // gray-900
    },
    subheader: {
      fontSize: 18,
      bold: true,
      color: '#4b5563', // gray-600
      margin: [0, 0, 0, 4],
    },
    dateText: {
      fontSize: 12,
      color: '#6b7280', // gray-500
    },
    dateTextBold: {
      fontSize: 12,
      bold: true,
      color: '#4b5563', // gray-600
    },
    dateHighlight: {
      fontSize: 12,
      bold: true,
      color: '#3b82f6', // blue-500
      lineHeight: 1.4,
    },
    reportMessage: {
      fontSize: 12,
      color: '#4b5563', // gray-600
      lineHeight: 1.4,
    },
    generatedByLabel: {
      fontSize: 12,
      color: '#6b7280', // gray-500
    },
    generatedByName: {
      fontSize: 12,
      bold: true,
      color: '#111827', // gray-900
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
    analysisHeader: {
      fontSize: 24,
      bold: true,
      color: '#334155', // slate-700
      margin: [0, 0, 0, 5],
    },
    sectionHeader: {
      fontSize: 16,
      bold: true,
      color: '#1f2937', // gray-800
      margin: [0, 0, 0, 8],
    },
    cardTitle: {
      fontSize: 14,
      color: '#4b5563', // gray-600
      margin: [0, 0, 0, 5],
    },
    cardValue: {
      fontSize: 18,
      bold: true,
      color: '#111827', // gray-900
    },
    positiveCardValue: {
      fontSize: 18,
      bold: true,
      color: '#16a34a', // green-600
    },
    negativeCardValue: {
      fontSize: 18,
      bold: true,
      color: '#dc2626', // red-600
    },
    footer: {
      fontSize: 10,
      italic: true,
      color: '#6b7280', // gray-500
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
    // Añadir número de página en el pie de página
    footer: function (currentPage: number, pageCount: number) {
      return {
        text: `Página ${currentPage} de ${pageCount}`,
        alignment: 'right',
        margin: [0, 0, 40, 0],
        fontSize: 8,
        color: '#9ca3af', // gray-400
      };
    },
  };

  const today = new Date().toISOString().split('T')[0]; // Fecha actual para el nombre del archivo
  pdfMake
    .createPdf(docDefinition)
    .download(`reporte_transacciones_${reportDate}.pdf`);
};






export default generatePDFService;
