import { QuizTokenType } from "../models/quiztoken";
import { BookType } from "../models/book";
import { ClassroomType } from "../models/classroom";
import { QuestionType } from "../models/question";
import { QuizQuestionType } from "../models/quiz_question";
import { RatingType } from "../models/rating";
import { StudentType } from "../models/student";
import { StudentAnswerType } from "../models/student_answer";
import { UserType } from "../models/user";
import { TeacherClassroomType } from "../models/teacher_classroom";

export interface DataType {
    id: number;
    dateCreated?: number;
    dateUpdated?: number;
    dateDeleted?: number;
}

export type DataRow = DataType & 
    QuizTokenType & 
    BookType & 
    ClassroomType & 
    QuestionType & 
    QuizQuestionType & 
    RatingType & 
    StudentType & 
    StudentAnswerType & 
    UserType & 
    TeacherClassroomType;

export const DEFAULT_PAGE_LIMIT = 2;
