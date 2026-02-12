/**
 * ============================================
 * SCRIPT: Create instructor users via Supabase Admin API
 * ============================================
 * 
 * This script uses the Supabase Admin API to create user accounts
 * for all instructors in the database.
 * 
 * REQUIREMENTS:
 * - Node.js installed
 * - Supabase Admin API key (get it from Project Settings > API > service_role key)
 * - Run: npm install @supabase/supabase-js
 * 
 * USAGE:
 * 1. Set your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * 2. Run: node database/create-instructor-users-api.js
 * 
 * ============================================
 */

const { createClient } = require('@supabase/supabase-js');

// CONFIGURATION - Replace with your values
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY'; // Admin key, not anon key!

// Create Supabase admin client
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Default password for new instructor accounts (they should change it on first login)
const DEFAULT_PASSWORD = 'TempPassword123!';

async function createInstructorUsers() {
  try {
    console.log('Fetching instructors from database...');
    
    // Get all instructors that need user accounts
    const { data: instructors, error: fetchError } = await supabaseAdmin
      .from('instructors')
      .select('id, name, email, phone, sede_id, bio')
      .not('email', 'is', null)
      .neq('email', '');

    if (fetchError) {
      console.error('Error fetching instructors:', fetchError);
      return;
    }

    if (!instructors || instructors.length === 0) {
      console.log('No instructors found with email addresses.');
      return;
    }

    console.log(`Found ${instructors.length} instructors to process.\n`);

    // Check which instructors already have user accounts
    const { data: existingUsers } = await supabaseAdmin
      .from('user_profiles')
      .select('email')
      .in('email', instructors.map(i => i.email));

    const existingEmails = new Set(existingUsers?.map(u => u.email) || []);
    const instructorsToCreate = instructors.filter(i => !existingEmails.has(i.email));

    console.log(`${existingEmails.size} instructors already have user accounts.`);
    console.log(`${instructorsToCreate.length} instructors need user accounts.\n`);

    if (instructorsToCreate.length === 0) {
      console.log('All instructors already have user accounts!');
      return;
    }

    // Create users for each instructor
    const results = {
      success: [],
      failed: []
    };

    for (const instructor of instructorsToCreate) {
      try {
        console.log(`Creating user for: ${instructor.name} (${instructor.email})...`);

        // Create auth user
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: instructor.email,
          password: DEFAULT_PASSWORD,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            full_name: instructor.name,
            role: 'instructor'
          }
        });

        if (authError) {
          console.error(`  ❌ Error creating auth user: ${authError.message}`);
          results.failed.push({ instructor, error: authError.message });
          continue;
        }

        if (!authUser.user) {
          console.error(`  ❌ No user returned from auth creation`);
          results.failed.push({ instructor, error: 'No user returned' });
          continue;
        }

        // Create user profile with instructor role
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            id: authUser.user.id,
            email: instructor.email,
            full_name: instructor.name,
            phone: instructor.phone || null,
            sede_id: instructor.sede_id || null,
            role: 'instructor',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error(`  ❌ Error creating profile: ${profileError.message}`);
          // Try to delete the auth user if profile creation failed
          await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
          results.failed.push({ instructor, error: profileError.message });
          continue;
        }

        console.log(`  ✅ User created successfully! ID: ${authUser.user.id}`);
        results.success.push({
          instructor,
          userId: authUser.user.id
        });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`  ❌ Unexpected error: ${error.message}`);
        results.failed.push({ instructor, error: error.message });
      }
    }

    // Summary
    console.log('\n========================================');
    console.log('SUMMARY');
    console.log('========================================');
    console.log(`✅ Successfully created: ${results.success.length} users`);
    console.log(`❌ Failed: ${results.failed.length} users`);
    
    if (results.failed.length > 0) {
      console.log('\nFailed instructors:');
      results.failed.forEach(({ instructor, error }) => {
        console.log(`  - ${instructor.name} (${instructor.email}): ${error}`);
      });
    }

    if (results.success.length > 0) {
      console.log('\n✅ Successfully created users:');
      results.success.forEach(({ instructor, userId }) => {
        console.log(`  - ${instructor.name} (${instructor.email}) - User ID: ${userId}`);
      });
      console.log(`\n📧 Default password for all new users: ${DEFAULT_PASSWORD}`);
      console.log('⚠️  Instructors should change their password on first login!');
    }

  } catch (error) {
    console.error('Fatal error:', error);
  }
}

// Run the script
createInstructorUsers();

