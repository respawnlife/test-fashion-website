#!/usr/bin/env node
/**
 * Initialize the database
 */
import { initializeDatabase } from '../models/database.js';

console.log('Initializing database...');
initializeDatabase();
console.log('Database initialization complete!');
