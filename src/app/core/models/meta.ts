export interface Meta {
    user_id: number;
    name: string;
    description?: string;
    target_amount: number;
    deadline?: string;
    status?: string;
}



export interface MetaTracking {
    meta_id: number;
    amount: number;
    note?: string;
    date: string;
}