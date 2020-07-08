import { DataRow, BaseResource } from "../db/types";
import { MemoryDb } from "../db/memory";

export interface StudentType extends DataRow {
    classroomId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    grade: number;
    userId: number;
};

export class Student
    extends BaseResource
    implements DataRow {

    public classroomId: number;
    public firstName: string;
    public middleName: string;
    public lastName: string;
    public grade: number;
    public userId: number;

    constructor(initialProperties?: {[property: string]: any}) {
        super('students');

        if (initialProperties) {
            this.classroomId = initialProperties.classroomId;
            this.firstName = initialProperties.firstName;
            this.middleName = initialProperties.middleName;
            this.lastName = initialProperties.lastName;
            this.grade = initialProperties.grade;
            this.userId = initialProperties.userId;
        }
    }

    public static findByUserId(userId: number) {
        const studentType: StudentType = MemoryDb.select('students', s => (s as StudentType).userId === userId)[0];

        return new Student().load(studentType.id);
    }
}