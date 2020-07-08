import { DataRow } from "../db/types";

export interface TeacherClassroom extends DataRow {
    teacherId: number;
    classroomId: number;
};
