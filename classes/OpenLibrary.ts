import { Book } from '@/models/Book';
import { Subject, SubjectRelation } from '@/models/Subject';
import axios from 'axios';

export class OpenLibrary {
    private readonly apiUrl = 'https://openlibrary.org/search.json';

    // Parse books from the Open Library API
    async parseBooks(start: number, limit: number = 10): Promise<void> {
        try {
            const response = await axios.get(this.apiUrl, {
                params: {
                    q: 'psychology', // Query all books
                    offset: start,
                    limit: limit,
                    fields:`title,author_name,subject,author_key,first_publish_year,language,number_of_pages_median`
                },
            });

            const booksData = response.data.docs;
            for (const bookData of booksData) {
                await this.parseBook(bookData);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    // Parse a single book and populate the updated model
    async parseBook(bookData: any): Promise<void> {
        try {
            // Map API data to the Book model
            const book = new Book();
            book.name = bookData.title || 'Unknown Title';
            book.description = bookData.description?.value || bookData.description || null;
            book.wikiLink = bookData.identifiers?.wikidata?.[0] || null;
            book.amazonLink = bookData.identifiers?.amazon?.[0] || null;
            book.readEstimate = bookData.readEstimate || 1000; // Default value
            book.publishDate = bookData.publish_date || null;
            book.writers = bookData.author_name?.join(', ') || 'Unknown Author';
            book.pageCount = bookData.number_of_pages || 0;

            // Save the book
            await book.save();

            // Process subjects
            book.subjects = book.subjects || [];
            const subjects = bookData.subject || [];
            const subjectIds:number[] = []
            for (const subjectName of subjects) {
                let subject = await Subject.findOne({ where: { name: subjectName } });
                if (!subject) {
                    subject = new Subject();
                    subject.name = subjectName;
                    await subject.save();
                }

                if (!subjectIds.includes(subject.id)) {
                    subjectIds.push(subject.id);
                    book.subjects.push(subject);
                }
                // Add subject to the book
            }

            await book.save();

            console.log(`Book by id(${book.id}) Saved!`);
            

            // Establish relationships between subjects
            await this.createSubjectRelations(book.subjects);
        } catch (error) {
            console.error('Error parsing book:', error);
        }
    }

    // Create or update relationships between subjects
    async createSubjectRelations(subjects: Subject[]): Promise<void> {
        for (let i = 0; i < subjects.length; i++) {
            for (let j = i + 1; j < subjects.length; j++) {
                const subject1 = subjects[i];
                const subject2 = subjects[j];

                // Check if the relationship already exists
                let relation = await SubjectRelation.findOne({
                    where: [
                        { subject1: { id: subject1.id }, subject2: { id: subject2.id } },
                        { subject1: { id: subject2.id }, subject2: { id: subject1.id } },
                    ],
                });

                if (relation) {
                    // If the relationship exists, increment the weight
                    relation.weight += 1;
                } else {
                    // Otherwise, create a new relationship
                    relation = new SubjectRelation();
                    relation.subject1 = subject1;
                    relation.subject2 = subject2;
                    relation.weight = 1;
                }

                await relation.save();
            }
        }
    }
}