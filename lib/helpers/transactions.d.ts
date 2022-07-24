import { Moment } from 'moment';
import { Transaction } from '../transactions';
export declare function fixInstallments(txns: Transaction[]): Transaction[];
export declare function sortTransactionsByDate(txns: Transaction[]): Transaction[];
export declare function filterOldTransactions(txns: Transaction[], startMoment: Moment, combineInstallments: boolean): Transaction[];
