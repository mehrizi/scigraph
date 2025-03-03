import { Book } from "@/models/Book";
import { Subject, SubjectRelation } from "@/models/Subject";
import axios from "axios";
import Benchmark from "./Benchmark";
import { In } from "typeorm";
import chalk from "chalk";

export class OpenLibrary {
  private readonly apiUrl = "https://openlibrary.org/search.json";
  private bench: Benchmark | null = null;

  // Parse books from the Open Library API
  async parseBooks(start: number, limit: number = 10): Promise<void> {
    this.bench = Benchmark.getInstance();
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          q: "math", // Query all books
          offset: start,
          limit: limit,
          fields: `title,author_name,subject,author_key,first_publish_year,language,number_of_pages_median`,
        },
      });

      const booksData = response.data.docs;
      for (const bookData of booksData) {
        await this.parseBook(bookData);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }

  // Parse a single book and populate the updated model
  async parseBook(bookData: any): Promise<void> {
    this.bench?.addEventStart(`Parsing Book '${chalk.red(bookData.title)}'`);
    try {
      // Map API data to the Book model
      const foundBook = await Book.findOne({ where: { name: bookData.title } });
      if (foundBook) {
        console.log(`Book by tile(${foundBook.name}) already exists!`);
        return;
      }

      const book = new Book();
      book.name = bookData.title || "Unknown Title";
      book.description =
        bookData.description?.value || bookData.description || null;
      book.wikiLink = bookData.identifiers?.wikidata?.[0] || null;
      book.amazonLink = bookData.identifiers?.amazon?.[0] || null;
      book.readEstimate = bookData.readEstimate || 1000; // Default value
      book.publishDate = bookData.publish_date || null;
      book.writers = bookData.author_name?.join(", ") || "Unknown Author";
      book.pageCount = bookData.number_of_pages || 0;

      // Save the book
      await book.save();

      // Process subjects
      const subjects = bookData.subject || [];
      const normalizedSubjects = subjects.flatMap((subject: string) =>
        this.normalizeSubject(subject)
      );
      book.subjects = book.subjects || [];
      const subjectIds: number[] = [];
      for (const subjectName of normalizedSubjects) {
        let subject = await Subject.findOne({ where: { name: subjectName } });
        if (!subject) {
          subject = new Subject();
          subject.name = subjectName;
          subject.weight = 1;
        } else subject.weight++;

        await subject.save();

        if (!subjectIds.includes(subject.id)) {
          subjectIds.push(subject.id);
          book.subjects.push(subject);
        }
        // Add subject to the book
      }

      await book.save();

      console.log(`Book by id(${book.id}) title(${book.name}) Saved!`);

      // Establish relationships between subjects
      await this.createSubjectRelations(book.subjects);
    } catch (error) {
      console.error("Error parsing book:", error);
    }
  }

  // Create or update relationships between subjects
  async createSubjectRelations(subjects: Subject[]): Promise<void> {
    this.bench?.addEventStart(
      `Creating relationships for ${subjects.length} Items`
    );
    const subjectIds = subjects.map((subject) => subject.id);

    // Fetch all existing relationships for the given subjects in a single query
    const existingRelations = await SubjectRelation.find({
      where: [{ subject1: In(subjectIds), subject2: In(subjectIds) }],
    });

    // Build a map to check for existing relationships
    const relationMap = new Map<string, SubjectRelation>();
    for (const relation of existingRelations) {
      const key1 = `${relation.subject1}-${relation.subject2}`;
      const key2 = `${relation.subject2}-${relation.subject1}`;
      relationMap.set(key1, relation);
      relationMap.set(key2, relation);
    }

    // Create or update relationships
    const relationsToSave: SubjectRelation[] = [];
    for (let i = 0; i < subjects.length; i++) {
      for (let j = i + 1; j < subjects.length; j++) {
        const subject1 = subjects[i];
        const subject2 = subjects[j];

        // Generate keys for the relationship
        const key1 = `${subject1.id}-${subject2.id}`;
        const key2 = `${subject2.id}-${subject1.id}`;

        // Check if the relationship already exists
        let relation = relationMap.get(key1) || relationMap.get(key2);

        if (relation) {
          // If the relationship exists, increment the weight
          relation.weight += 1;
        } else {
          // Otherwise, create a new relationship
          relation = new SubjectRelation();
          relation.subject1 = subject1.id;
          relation.subject2 = subject2.id;
          relation.weight = 1;

          // Add the new relationship to the map
          relationMap.set(key1, relation);
          relationMap.set(key2, relation);
        }

        relationsToSave.push(relation);
      }
    }

    // Save all relationships in a single query
    await SubjectRelation.save(relationsToSave);
  }

  normalizeSubject(input: string): string[] {
    // Step 1: Remove parentheses and their contents
    const withoutParentheses = input.replace(/\([^)]*\)/g, "");

    // Step 2: Split by "/", ",", and "--"
    const splitItems = withoutParentheses.split(/[/,—]+/);

    // Step 3: Process each item
    const normalizedItems = splitItems.map((item) => {
      // Convert single hyphens to spaces
      const withSpaces = item.replace(/(?<!-)-(?!-)/g, " ");

      // Remove any remaining non-alphanumeric characters (except spaces)
      const alphanumericOnly = withSpaces.replace(/[^a-z0-9\s]/gi, "");

      // Trim whitespace and convert to lowercase
      return alphanumericOnly.trim().toLowerCase();
    });

    // Step 4: Filter out items with more than 2 numeric characters
    const filteredItems = normalizedItems.filter((item) => {
      const numericCharacterCount = item.match(/\d/g)?.length || 0;
      return numericCharacterCount <= 3;
    });

    // Step 5: Remove empty items and duplicates
    const uniqueItems = [
      ...new Set(filteredItems.filter((item) => item.length > 0)),
    ];

    return uniqueItems;
  }
}
