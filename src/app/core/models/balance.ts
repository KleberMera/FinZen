// export interface Balance {
//   totalIncome: number;
//   totalExpenses: number;
//   balance: number;
//   currency: string;
//   month: string;
//   monthName: string;
//   year: number;
// }



interface currentMonth {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    currency: string;
    month: number;
    monthName: string;
    year: number;
}

interface previousMonth {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    currency: string;
    month: number;
    monthName: string;
    year: number;
}

interface comparison {
    incomePercentageChange: number;
    expensesPercentageChange: number;
    balancePercentageChange: number;
}

export interface Balance {
    currentMonthData: currentMonth;
    previousMonthData: previousMonth;

}


// "currentMonth": {
// 			"totalIncome": 230,
// 			"totalExpenses": 80,
// 			"balance": 150,
// 			"currency": "USD",
// 			"month": 2,
// 			"year": 2025
// 		},
// 		"previousMonth": {
// 			"totalIncome": 500,
// 			"totalExpenses": 122,
// 			"balance": 378,
// 			"currency": "USD",
// 			"month": 1,
// 			"year": 2025
// 		},
// 		"comparison": {
// 			"incomePercentageChange": -54,
// 			"expensesPercentageChange": -34.42622950819672,
// 			"balancePercentageChange": -60.317460317460316
// 		}