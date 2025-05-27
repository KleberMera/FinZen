export interface Goal {
    id? : number;
    user_id: number;
    name: string;
    description?: string;
    target_amount: number;
    deadline?: string;
    initial_amount?: number;
    start_date?: string;
    status?: string;
}



export interface GoalContribution {
    meta_id: number;
    amount: number;
    note?: string;
    date: string;
}