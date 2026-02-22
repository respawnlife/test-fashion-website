#!/usr/bin/env node
/**
 * Seed admin user to database
 */
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { db, initializeDatabase } from '../models/database.js';

dotenv.config();

async function seedAdmin() {
  console.log('Seeding admin user...');
  
  // Initialize database first
  initializeDatabase();
  
  const username = process.env.ADMIN_USERNAME || 'moo';
  const password = process.env.ADMIN_PASSWORD || 'mootest1212';
  
  // Check if admin already exists
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  
  if (existing) {
    console.log(`Admin user "${username}" already exists.`);
    return;
  }
  
  // Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  // Create admin user
  db.prepare(`
    INSERT INTO users (username, password_hash, email, role, is_active) 
    VALUES (?, ?, ?, ?, ?)
  `).run(username, passwordHash, 'admin@fashion-website.com', 'admin', 1);
  
  console.log(`Admin user "${username}" created successfully!`);
  console.log('Username:', username);
  console.log('Password:', password);
  console.log('\nPlease change the default password after first login!');
}

seedAdmin().catch(console.error);
