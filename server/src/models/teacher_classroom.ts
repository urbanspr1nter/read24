import { DataType } from "../db/types";
import { BaseResource } from "../db/base_resource";
import { DatabaseConnector } from "../config";
import { Classroom } from "./classroom";
import { Teacher } from "./teacher";

export interface TeacherClassroomType extends DataType {
    teacherId: number;
    classroomId: number;
};

export class TeacherClassroom 
    extends BaseResource 
    implements TeacherClassroomType {
    
    public teacherId: number;
    public classroomId: number;

    constructor(initialProperties?: {[property: string]: any}) {
        super('teacher_classroom');

        if (initialProperties) {
            this.teacherId = initialProperties.teacherId;
            this.classroomId = initialProperties.classroomId;
        }
    }

    public static async findByTeacherAndClassroomId(teacherId: number, classroomId: number) {
        const teacherClassrooms = await DatabaseConnector.select('teacher_classroom', {
            filters: [{
                column: 'classroomId',
                value: classroomId
            }, {
                column: 'teacherId',
                value: teacherId
            }]
        });

        if (teacherClassrooms.length === 0)
            return undefined;

        return await new TeacherClassroom().load(teacherClassrooms[0].id);
    }

    public static async findTeacherByClassroomId(classroomId: number) {
        const teacherIds = await DatabaseConnector.select('teacher_classroom', {
            filters: [{
                column: 'classroomId',
                value: classroomId
            }]
        });

        const teachers = await Promise.all(teacherIds.map(async tc => await new Teacher().load(tc.teacherId)));

        if (teachers.length === 0)
            return undefined;

        return teachers[0];
    }

    public static async findClassroomByTeacherId(teacherId: number) {
        const classroomIds = await DatabaseConnector.select('teacher_classroom', {
            filters: [{
                column: 'teacherId',
                value: teacherId
            }]
        });

        const classrooms = await Promise.all(classroomIds.map(async tc => await new Classroom().load(tc.classroomId)));

        if (classrooms.length === 0)
            return undefined;
    
        return classrooms[0];
    }
}
