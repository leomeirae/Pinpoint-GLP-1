#!/usr/bin/env node

/**
 * Script to inspect current Supabase tables and compare with requirements
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDatabase() {
  console.log('🔍 Inspecting Supabase Database...\n');
  console.log('📊 Database URL:', supabaseUrl);
  console.log('─'.repeat(80) + '\n');

  try {
    // Get all tables in public schema
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      console.log('⚠️  Cannot query information_schema directly via REST API');
      console.log('   Using alternative method...\n');

      // Try to query known tables
      await checkKnownTables();
      return;
    }

    if (tables && tables.length > 0) {
      console.log('✅ Found tables:');
      tables.forEach(t => console.log('   -', t.table_name));
    }
  } catch (error) {
    console.log('⚠️  Error querying database:', error.message);
    console.log('   Trying alternative method...\n');
    await checkKnownTables();
  }
}

async function checkKnownTables() {
  const tablesToCheck = [
    'users',
    'profiles',
    'medications',
    'medication_applications',
    'weight_logs',
    'side_effects',
    'applications',
    'weights',
    'settings'
  ];

  console.log('🔎 Checking for known tables:\n');

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(0);

      if (error) {
        if (error.code === 'PGRST204' || error.message.includes('relation') || error.message.includes('does not exist')) {
          console.log(`❌ ${table.padEnd(25)} - Does not exist`);
        } else if (error.code === '42501' || error.message.includes('permission denied')) {
          console.log(`⚠️  ${table.padEnd(25)} - Exists but no permission (need RLS policies)`);
        } else {
          console.log(`❓ ${table.padEnd(25)} - Error: ${error.message}`);
        }
      } else {
        console.log(`✅ ${table.padEnd(25)} - Exists and accessible`);
      }
    } catch (err) {
      console.log(`❓ ${table.padEnd(25)} - Unexpected error: ${err.message}`);
    }
  }

  console.log('\n' + '─'.repeat(80) + '\n');
  await compareWithRequirements();
}

async function compareWithRequirements() {
  console.log('📋 REQUIRED TABLES FOR MOUNJARO TRACKER:\n');

  const requiredTables = {
    'profiles': {
      description: 'User profile data (height, weight goals, medication)',
      columns: ['id', 'name', 'email', 'height', 'start_weight', 'target_weight', 'medication', 'current_dose', 'frequency']
    },
    'applications': {
      description: 'Injection records (shots)',
      columns: ['id', 'user_id', 'date', 'dosage', 'injection_sites', 'side_effects', 'notes']
    },
    'weights': {
      description: 'Weight tracking logs',
      columns: ['id', 'user_id', 'date', 'weight', 'notes']
    },
    'settings': {
      description: 'User preferences (theme, notifications)',
      columns: ['id', 'user_id', 'theme', 'accent_color', 'dark_mode', 'shot_reminder', 'weight_reminder']
    }
  };

  for (const [table, info] of Object.entries(requiredTables)) {
    console.log(`\n📦 ${table.toUpperCase()}`);
    console.log(`   ${info.description}`);
    console.log(`   Required columns: ${info.columns.join(', ')}`);
  }

  console.log('\n' + '─'.repeat(80) + '\n');

  console.log('🔧 EXISTING TABLES COMPARISON:\n');

  // Check if existing tables match our needs
  const existingTables = ['users', 'medications', 'medication_applications', 'weight_logs', 'side_effects'];
  const ourTables = ['profiles', 'applications', 'weights', 'settings'];

  console.log('Existing (from lib/supabase.ts types):');
  existingTables.forEach(t => console.log(`   - ${t}`));

  console.log('\nRequired for new structure:');
  ourTables.forEach(t => console.log(`   - ${t}`));

  console.log('\n💡 RECOMMENDATION:\n');
  console.log('The existing tables (users, medications, medication_applications, weight_logs)');
  console.log('have a different structure than what we need for FASE 8-10 features.');
  console.log('\nOptions:');
  console.log('  1. Create new tables alongside existing ones (safest)');
  console.log('  2. Migrate data from old tables to new ones');
  console.log('  3. Adapt our code to use existing tables');

  console.log('\n✅ RECOMMENDED APPROACH:');
  console.log('Create the new tables (profiles, applications, weights, settings)');
  console.log('and keep existing tables for backward compatibility.\n');
}

inspectDatabase().catch(console.error);
