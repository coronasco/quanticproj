import { Timestamp } from "firebase/firestore";

// Income type
export interface IncomeType {
    id: string;
    cash: number;
    pos: number;
    total: number;
    date: Timestamp; 
}

// User type
export interface User {
    uid: string;
    email: string;
}

// Expense interface
export interface ExpenseType {
    id: string;
    amount: number;
    description: string;
    category: string;
    date: Date | Timestamp;
  }
  