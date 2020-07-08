import { DataRow } from "../db/types";

export interface Teacher extends DataRow {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    userId: number;
};
