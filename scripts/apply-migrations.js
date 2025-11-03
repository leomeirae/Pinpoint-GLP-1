/**
 * Script to apply database migrations to Supabase
 *
 * Usage:
 *   node scripts/apply-migrations.js
 *
 * Environment variables required:
 *   EXPO_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (from Supabase dashboard > Settings > API)
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('  - EXPO_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nAdd SUPABASE_SERVICE_ROLE_KEY to your .env file');
  console.error('Get it from: Supabase Dashboard > Settings > API > service_role key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');

// Get list of migration files
function getMigrationFiles() {
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort();

  return files;
}

// Apply a single migration
async function applyMigration(filename) {
  const filepath = path.join(MIGRATIONS_DIR, filename);
  const sql = fs.readFileSync(filepath, 'utf8');

  console.log(`\n📝 Applying migration: ${filename}`);

  try {
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });

    if (error) {
      // If exec_sql function doesn't exist, try direct execution
      // Note: This requires appropriate permissions
      console.log('   Attempting direct SQL execution...');

      // Split by semicolon and execute each statement
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        const { error: execError } = await supabase.rpc('exec', {
          sql: statement + ';'
        });

        if (execError) {
          throw execError;
        }
      }
    }

    console.log(`✅ Successfully applied: ${filename}`);
    return { success: true, filename };

  } catch (error) {
    console.error(`❌ Error applying ${filename}:`);
    console.error(`   ${error.message}`);
    return { success: false, filename, error: error.message };
  }
}

// Main function
async function main() {
  console.log('🚀 Starting database migrations...\n');
  console.log(`📁 Migrations directory: ${MIGRATIONS_DIR}`);

  const migrationFiles = getMigrationFiles();

  if (migrationFiles.length === 0) {
    console.log('⚠️  No migration files found.');
    return;
  }

  console.log(`\n📋 Found ${migrationFiles.length} migration(s):`);
  migrationFiles.forEach(file => console.log(`   - ${file}`));

  const results = [];

  for (const file of migrationFiles) {
    const result = await applyMigration(file);
    results.push(result);

    // Stop on first error
    if (!result.success) {
      console.log('\n❌ Stopping migrations due to error.');
      break;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary:');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📝 Total: ${results.length}`);

  if (failed > 0) {
    console.log('\n⚠️  Some migrations failed. Please check errors above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All migrations applied successfully!');
  }
}

// Run
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
