create table books (
	`id` bigint primary key auto_increment,
    `dateCreated` bigint null,
    `dateUpdated` bigint null,
    `title` varchar(255) null,
    `fiction` tinyint(1) default 0,
    `author` varchar(255) null,
    `year` varchar(255) null,
    `publisher` varchar(255) null,
    `genre` int null,
    `isbn` varchar(255) null,
    `lexile` int default 0,
    `wordCount` int default 0
);

create table choices (
	`id` bigint primary key auto_increment,
    `dateCreated` bigint null,
    `dateUpdated` bigint null,
    `questionId` bigint not null,
    `content` text null,
    `answer` tinyint(1) default 0
);

create table classrooms (
	`id` bigint primary key auto_increment,
    `dateCreated` bigint null,
    `dateUpdated` bigint null,
    `name` varchar(255) null,
    `slug` varchar(255) not null
);

create table questions (
	`id` bigint primary key auto_increment,
    `dateCreated` bigint null,
    `dateUpdated` bigint null,
    `bookId` bigint not null,
    `content` text null
);

create table quiz_questions (
	`id` bigint primary key auto_increment,
    `dateCreated` bigint null,
    `dateUpdated` bigint null,
    `quizToken` varchar(255) not null,
    `questionId` bigint not null
);

create table quiz_tokens (
	`id` bigint primary key auto_increment,
    `dateCreated` bigint null,
    `dateUpdated` bigint null,
    `studentId` bigint null,
    `bookId` bigint null,
    `token` varchar(255) null,
    `status` tinyint not null default 0
);

create table ratings (
	`id` bigint primary key auto_increment,
    `dateCreated` bigint null,
    `dateUpdated` bigint null,
	`quizToken` varchar(255) not null,
	`rating` int not null
);

create table students (
	`id` bigint primary key auto_increment,
    `dateCreated` bigint null,
    `dateUpdated` bigint null,
    `classroomId` bigint not null,
    `firstName` varchar(255) null,
    `middleName` varchar(255) null,
    `lastName` varchar(255) null,
    `grade` int null,
    `userId` bigint not null
);

create table student_answers (
	`id` bigint primary key auto_increment,
    `dateCreated` bigint null,
    `dateUpdated` bigint null,
    `quizToken` varchar(255),
    `studentId` bigint not null,
    `questionId` bigint not null,
    `choiceId` bigint not null
);

create table users (
	`id` bigint primary key auto_increment,
    `dateCreated` bigint null,
    `dateUpdated` bigint null,
    `username` varchar(255) not null,
    `password` text not null,
    `salt` text not null
);

alter table books add `dateDeleted` bigint not null default 0;
alter table choices add `dateDeleted` bigint not null default 0;
alter table classrooms add `dateDeleted` bigint not null default 0;
alter table questions add `dateDeleted` bigint not null default 0;
alter table quiz_questions add `dateDeleted` bigint not null default 0;
alter table quiz_tokens add `dateDeleted` bigint not null default 0;
alter table ratings add `dateDeleted` bigint not null default 0;
alter table student_answers add `dateDeleted` bigint not null default 0;
alter table students add `dateDeleted` bigint not null default 0;
alter table users add `dateDeleted` bigint not null default 0;

alter table books ADD fulltext (title);
alter table books ADD fulltext (author);

create table teacher_classroom (
	`id` bigint primary key auto_increment,
    `dateCreated` bigint null,
    `dateUpdated` bigint null,
    `dateDeleted` bigint not null default 0,
    `teacher_id` bigint,
    `classroom_id` bigint
);
