export interface Goal {
    id? : number;
    user_id: number;
    name: string;
    description?: string;
    target_amount: number;
    deadline?: string;

    start_date?: string;
    status?: string;
}



export interface GoalContribution {
    id? : number;
    goal_id: number;
    amount: number;
    note?: string;
    date: string;
}



  export interface DataProgress {
    progress: Progress
  }
  
  export interface Progress {
    targetAmount: number
    startDate: string
    deadline: string
    totalContributed: number
    contributionsCount: number
    financialProgress: number
    timeProgress: number
    daysRemaining: number
    isOverdue: boolean
    progressStatus: string
    remainingAmount: number
    lastContribution: LastContribution
  }
  
  export interface LastContribution {
    amount: number
    date: string
  }