insert into classrooms set name = 'Room 4', slug = 'room4';
insert into users set username = 'stu01', password = '$2b$07$uLoKxQ9vxs7jKVSZ8u7pMuQx5d0SvYZL0NkXX/S08FqHECGG2yB9u', salt = '$2b$07$uLoKxQ9vxs7jKVSZ8u7pMu';
insert into students set classroomId = 1, firstName = 'Stu', lastName = 'Dent', grade = 5, userId = 1;
insert into books set title = 'Where the Red Fern Grows', author = 'Wilson Rawls', fiction = 1, year = '1974', publisher = 'Bantam Books', genre = 0, isbn = '978-0-553-12338-8', wordCount = 75528, lexile = 700;
insert into questions set bookId = 1, content = 'WTRFG - First question';
insert into questions set bookId = 1, content = 'WTRFG - Second question';
insert into questions set bookId = 1, content = 'WTRFG - Third question';
insert into questions set bookId = 1, content = 'WTRFG - Fourth question';
insert into questions set bookId = 1, content = 'WTRFG - Fifth question';
insert into questions set bookId = 1, content = 'WTRFG - Sixth question';
insert into questions set bookId = 1, content = 'WTRFG - Seventh question';
insert into questions set bookId = 1, content = 'WTRFG - Eighth question';
insert into questions set bookId = 1, content = 'WTRFG - Nineth question';
insert into questions set bookId = 1, content = 'WTRFG - Tenth question';
insert into choices set questionId = 1, content = 'First choice', answer = true;
insert into choices set questionId = 1, content = 'Second choice';
insert into choices set questionId = 1, content = 'Third choice';
insert into choices set questionId = 1, content = 'Fourth choice';
insert into choices set questionId = 2, content = 'First choice', answer = true;
insert into choices set questionId = 2, content = 'Second choice';
insert into choices set questionId = 2, content = 'Third choice';
insert into choices set questionId = 2, content = 'Fourth choice';
insert into choices set questionId = 3, content = 'First choice', answer = true;
insert into choices set questionId = 3, content = 'Second choice';
insert into choices set questionId = 3, content = 'Third choice';
insert into choices set questionId = 3, content = 'Fourth choice';
insert into choices set questionId = 4, content = 'First choice', answer = true;
insert into choices set questionId = 4, content = 'Second choice';
insert into choices set questionId = 4, content = 'Third choice';
insert into choices set questionId = 4, content = 'Fourth choice';
insert into choices set questionId = 5, content = 'First choice', answer = true;
insert into choices set questionId = 5, content = 'Second choice';
insert into choices set questionId = 5, content = 'Third choice';
insert into choices set questionId = 5, content = 'Fourth choice';
insert into choices set questionId = 6, content = 'First choice', answer = true;
insert into choices set questionId = 6, content = 'Second choice';
insert into choices set questionId = 6, content = 'Third choice';
insert into choices set questionId = 6, content = 'Fourth choice';
insert into choices set questionId = 7, content = 'First choice', answer = true;
insert into choices set questionId = 7, content = 'Second choice';
insert into choices set questionId = 7, content = 'Third choice';
insert into choices set questionId = 7, content = 'Fourth choice';
insert into choices set questionId = 8, content = 'First choice', answer = true;
insert into choices set questionId = 8, content = 'Second choice';
insert into choices set questionId = 8, content = 'Third choice';
insert into choices set questionId = 8, content = 'Fourth choice';
insert into choices set questionId = 9, content = 'First choice', answer = true;
insert into choices set questionId = 9, content = 'Second choice';
insert into choices set questionId = 9, content = 'Third choice';
insert into choices set questionId = 9, content = 'Fourth choice';
insert into choices set questionId = 10, content = 'First choice', answer = true;
insert into choices set questionId = 10, content = 'Second choice';
insert into choices set questionId = 10, content = 'Third choice';
insert into choices set questionId = 10, content = 'Fourth choice';