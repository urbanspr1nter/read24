import { DatabaseConnector, AggregateType } from "../../db/connector";
import { Classroom } from "../../models/classroom";
import { Book } from "../../models/book";

describe('memory database tests', () => {
    it('should find a classroom by id', async () => {
        const classroom = await DatabaseConnector.find('classrooms', 1);

        expect(classroom.name).toBe('Room 10');
        expect(classroom.slug).toBe('room10');
    });

    it('should select classroom by slug', async () => {
        const classroom = (await DatabaseConnector.select('classrooms', {
            filters: [
                {
                    column: 'slug',
                    value: 'room10'
                }
            ]
        }))[0];

        expect(classroom.name).toBe('Room 10');
        expect(classroom.slug).toBe('room10');
    });

    it('should select classroom by slug and name', async () => {
        const classroom = (await DatabaseConnector.select('classrooms', {
            filters: [
                {
                    column: 'slug',
                    value: 'room5'
                },
                {
                    column: 'name',
                    value: 'Room 5'
                }
            ]
        }))[0];

        expect(classroom.name).toBe('Room 5');
        expect(classroom.slug).toBe('room5');
    });

    it('should select classroom by non-existent name', async () => {
        const classroom = (await DatabaseConnector.select('classrooms', {
            filters: [
                {
                    column: 'slug',
                    value: 'room5'
                },
                {
                    column: 'name',
                    value: 'Room 54444'
                }
            ]
        }))[0];

        expect(classroom).toBeUndefined();
    });

    it('should select classrooms with only column', async () => {
        const classrooms = await DatabaseConnector.select('classrooms', {
            columns: ['name']
        });

        expect(classrooms).toHaveLength(2);
        for(const c of classrooms) {
            expect(Object.keys(c)).toHaveLength(1);
        }
    });

    it('should select the count of classrooms', async () => {
        const count = (await DatabaseConnector.select('classrooms', {
            aggregate: {
                type: AggregateType.Count,
                alias: 'count',
                column: 'id'
            }
        }))[0]['count'];

        expect(count).toBe(2);
    });

    it('should update a classroom', async () => {
        const updated = (await DatabaseConnector.update('classrooms', {
            name: 'Room 05',
            id: 2
        }));

        const selected = (await DatabaseConnector.select('classrooms', {
            filters: [{
                column: 'id',
                value: 2
            }]
        }))[0];

        expect(updated).toBe(1);
        expect(selected.name).toBe('Room 05');
        expect(selected.slug).toBe('room5');
    });

    it('should perform a full-text search on name', async () => {
        const classroom = (await DatabaseConnector.select('classrooms', {
            fullTextMatch: [
                {
                    columns: ['name'],
                    value: '10'
                }
            ]
        }))[0];

        expect(classroom.name).toBe('Room 10');
    });

    it('should delete a classroom (hard delete)', async () => {
        const selected = (await DatabaseConnector.select('classrooms', {
            filters: [{
                column: 'name',
                value: 'Room 05'
            }]
        }))[0];

        expect(selected.id).toBe(2);

        const deletedCount = await DatabaseConnector.delete('classrooms', {
            hardDelete: true,
            filters: [{
                column: 'name',
                value: selected.name
            }]
        });

        expect(deletedCount).toBe(1);

        const result = (await DatabaseConnector.select('classrooms', {
            filters: [{
                column: 'name',
                value: selected.name
            }]
        }))[0];

        expect(result).toBeUndefined();

        const tableCount = (await DatabaseConnector.select('classrooms', {
            aggregate: {
                type: AggregateType.Count,
                column: 'id',
                alias: 'count'
            }
        }))[0]['count'];

        expect(tableCount).toBe(1);
    });

    it('should still select logically deleted items', async () => {
        const newClassroom = await new Classroom({
            name: 'Room 4',
            slug: 'room4'
        }).insert();

        const count = (await DatabaseConnector.select('classrooms', {
            aggregate: {
                type: AggregateType.Count,
                alias: 'count',
                column: 'id'
            }
        }))[0]['count'];

        expect(count).toBe(2);

        await newClassroom.delete();

        const newCount = (await DatabaseConnector.select('classrooms', {
            aggregate: {
                type: AggregateType.Count,
                alias: 'count',
                column: 'id'
            },
            includeDeleted: true
        }))[0]['count'];

        expect(newCount).toBe(2);
    });

    it('should return a count even with empty column list', async () => {
        const count = (await DatabaseConnector.select('classrooms', {
            aggregate: {
                type: AggregateType.Count,
                alias: 'count',
                column: 'id'
            },
            columns: []
        }))[0]['count'];

        expect(count).toBe(1);
    });

    it('should return a db object dump', async () => {
        const dumped = DatabaseConnector.dump();

        expect(dumped).not.toBeUndefined();
        expect(dumped).not.toBeNull();
    });

    it('should initialize db', async () => {
        const dumped = DatabaseConnector.dump();

        expect(dumped).not.toBeUndefined();
        expect(dumped).not.toBeNull();

        const count = (await DatabaseConnector.select('classrooms', {
            aggregate: {
                type: AggregateType.Count,
                alias: 'count',
                column: 'id'
            }
        }))[0]['count'];

        expect(count).toBe(1);

        dumped['classrooms'].data.forEach(c => {
            c.dateDeleted = 0;
        });

        DatabaseConnector.initialize(dumped);

        const newCount = (await DatabaseConnector.select('classrooms', {
            aggregate: {
                type: AggregateType.Count,
                alias: 'count',
                column: 'id'
            }
        }))[0]['count'];

        expect(newCount).toBe(2);
    });

    it('should insert a book with boolean as a tinyint(1)', async () => {
        const payload = {
            title: '0001 book',
            author: 'Author B',
            fiction: true,
            year: '1990',
            publisher: 'Scholastic',
            genre: 1,
            isbn: '12345',
            lexile: 199,
            wordCount: 12345
        };

        const book = new Book(payload);
        await book.insert();
        const selected = await DatabaseConnector.find('books', book.id);
        expect(selected.fiction).toBe(1);

        const secondBook = new Book({...payload, title: '0002 book', fiction: false, lexile: 999, author: 'Author A'});
        await secondBook.insert();
        const secondSelected = await DatabaseConnector.find('books', secondBook.id);
        expect(secondSelected.fiction).toBe(0);
    });

    it('should no-op if an update does not consist of an id', async () => {
        const payload = {
            title: 'Test book',
            author: 'Test author',
            fiction: false,
            year: '1990',
            publisher: 'Scholastic',
            genre: 1,
            isbn: '12345',
            lexile: 199,
            wordCount: 12345
        };

        const rowsUpdated = await DatabaseConnector.update('books', payload);

        expect(rowsUpdated).toBe(0);
    });

    it('should update a book with boolean as a tinyint(1)', async () => {
        const book = await new Book().load(2);

        book.fiction = true;
        await book.update();
        const selected = await DatabaseConnector.find('books', 2);
        expect(selected.fiction).toBe(1);

        book.fiction = false;
        await book.update();

        const newSelected = await DatabaseConnector.find('books', 2);
        expect(newSelected.fiction).toBe(0);
    });

    it('should order list of books by title descending', async () => {
        const list = (await DatabaseConnector.select('books', {
            orderBy: {
                ascending: false,
                column: 'title'
            }
        }));

        expect(list[0].title).toBe('0002 book');
        expect(list[1].title).toBe('0001 book');
    });

    it('should order list of books by title ascending', async () => {
        const list = (await DatabaseConnector.select('books', {
            orderBy: {
                ascending: true,
                column: 'title'
            }
        }));

        expect(list[0].title).toBe('0001 book');
        expect(list[1].title).toBe('0002 book');
    });

    it('should order list of books by author ascending', async () => {
        const list = (await DatabaseConnector.select('books', {
            orderBy: {
                ascending: true,
                column: 'author'
            }
        }));

        expect(list[0].title).toBe('0002 book');
        expect(list[1].title).toBe('0001 book');
    });

    it('should order list of books by author descending', async () => {
        const list = (await DatabaseConnector.select('books', {
            orderBy: {
                ascending: false,
                column: 'author'
            }
        }));

        expect(list[0].title).toBe('0001 book');
        expect(list[1].title).toBe('0002 book');
    });

    it('should order list of books by lexile ascending', async () => {
        const list = (await DatabaseConnector.select('books', {
            orderBy: {
                ascending: true,
                column: 'lexile'
            }
        }));

        expect(list[0].lexile).toBe(199);
        expect(list[1].lexile).toBe(999);
    });

    it('should order list of books by lexile descending', async () => {
        const list = (await DatabaseConnector.select('books', {
            orderBy: {
                ascending: false,
                column: 'lexile'
            }
        }));

        expect(list[0].lexile).toBe(999);
        expect(list[1].lexile).toBe(199);
    });

    it('should order list of books by publisher ascending', async () => {
        const list = (await DatabaseConnector.select('books', {
            orderBy: {
                ascending: true,
                column: 'publisher'
            }
        }));

        expect(list[0].publisher).toBe('Scholastic');
        expect(list[1].publisher).toBe('Scholastic');
    });


    it('should order list of books by publisher descending', async () => {
        const list = (await DatabaseConnector.select('books', {
            orderBy: {
                ascending: false,
                column: 'publisher'
            }
        }));

        expect(list[0].publisher).toBe('Scholastic');
        expect(list[1].publisher).toBe('Scholastic');
    });

    it('should perform limit query', async () => {
        const list = (await DatabaseConnector.select('books', {
            limit: 1,
            offset: 0
        }));

        expect(list[0].title).toBe('0001 book');
    });

    it('should perform limit query with an offset', async () => {
        const list = (await DatabaseConnector.select('books', {
            limit: 1,
            offset: 1
        }));

        expect(list[0].title).toBe('0002 book');
    });

    it('should not allow to select with columns and aggregate', async () => {
        let error = null;
        try {
            await DatabaseConnector.select('books', {
                columns: ['id'], 
                aggregate: {
                    type: AggregateType.Count,
                    column: 'id',
                    alias: 'count'
                }
            });    
        } catch (e) {
            error = e;
        }

        expect(error).not.toBeNull();
    });

    it('should select and return results only with specified columns', async () => {
        const list = await DatabaseConnector.select('books', {
            columns: ['id', 'title']
        });

        expect(list).toHaveLength(2);
        for(const r of list) {
            expect(Object.keys(r)).toHaveLength(2);
        }
    });

    it('should not allow delete an in unfiltered manner', async () => {
        const deleted = await DatabaseConnector.delete('books', {hardDelete: true, filters: []});
        expect(deleted).toBe(0);
    });

    it('should delete with an in-clause', async () => {
        await DatabaseConnector.delete('books', {
            hardDelete: true, 
            filters: [], 
            in: {
                column: 'id',
                value: [1, 2]
            }
        });

        const list = await DatabaseConnector.select('books', {});

        expect(list).toHaveLength(0);
    });
});
