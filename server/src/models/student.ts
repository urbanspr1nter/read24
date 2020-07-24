import { DataType } from "../db/types";
import { DatabaseConnector } from "../db/connector";
import { BaseResource } from "../db/base_resource";

export interface StudentType extends DataType {
    classroomId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    grade: number;
    userId: number;
};

export class Student
    extends BaseResource
    implements StudentType {

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

    public static async findByUserId(userId: number) {
        const studentType = (await DatabaseConnector.select('students', s => (s as StudentType).userId === userId))[0];

        return await new Student().load(studentType.id);
    }

    public static async listByClassroomId(classroomId: number) {
        const studentTypes = await DatabaseConnector.select('students', (s: StudentType) => s.classroomId === classroomId) as StudentType[];

        return await Promise.all(studentTypes.map(async s => await new Student().load(s.id)));
    }
}