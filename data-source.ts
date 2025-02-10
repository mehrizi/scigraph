import { DataSource } from 'typeorm';
import { AppDataSource } from './models/Db';

// Merge DataSource options with seeder options
// const options: DataSourceOptions & SeederOptions = {
const options = {
    ...AppDataSource.options,
    seeds: ['models/seeds/**/*{.ts,.js}'],
};

// Create and export a new DataSource instance
export const dataSource = new DataSource(options);
