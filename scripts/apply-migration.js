#!/usr/bin/env node

/**
 * Script to apply SQL migration to Supabase
 * Usage: node scripts/apply-migration.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Read the migration file
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');
const sqlContent = fs.readFileSync(migrationPath, 'utf8');

console.log('🚀 Applying SQL migration to Supabase...\n');
console.log('📄 Migration file:', migrationPath);
console.log('🔗 Supabase URL:', SUPABASE_URL);
console.log('\n⚠️  IMPORTANT: This script uses the anon key which has limited permissions.');
console.log('⚠️  For migrations, you need to use the service_role key or apply via Supabase Dashboard.\n');

console.log('📋 SQL Migration Preview:');
console.log('─'.repeat(80));
console.log(sqlContent.substring(0, 500) + '...\n');
console.log('─'.repeat(80));

console.log('\n✅ Migration file is ready!');
console.log('\n📝 To apply this migration, please:');
console.log('   1. Go to: https://iokunvykvndmczfzdbho.supabase.co');
console.log('   2. Click "SQL Editor" in the left sidebar');
console.log('   3. Click "+ New Query"');
console.log('   4. Copy the entire content from:');
console.log('      /Users/user/Desktop/mounjaro-tracker/supabase/migrations/001_initial_schema.sql');
console.log('   5. Paste into the SQL Editor');
console.log('   6. Click "Run" to execute');

console.log('\n🔐 Or get your service_role key from Supabase Dashboard > Project Settings > API');
console.log('   and add it to .env.local as SUPABASE_SERVICE_ROLE_KEY\n');

// Alternatively, if user wants to use curl
console.log('\n💡 Alternative: Use curl with service_role key:');
console.log('─'.repeat(80));
console.log(`curl -X POST '${SUPABASE_URL}/rest/v1/rpc/exec_sql' \\`);
console.log(`  -H "apikey: YOUR_SERVICE_ROLE_KEY" \\`);
console.log(`  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \\`);
console.log(`  -H "Content-Type: application/json" \\`);
console.log(`  -d '{"query": "...SQL_HERE..."}'`);
console.log('─'.repeat(80) + '\n');
