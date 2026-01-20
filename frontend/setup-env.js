#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Read the template file
const templatePath = path.join(__dirname, 'env-template.txt')
const envPath = path.join(__dirname, '.env.local')

if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file already exists!')
  console.log('📝 Please update it with your Supabase credentials:')
  console.log('   - Open .env.local')
  console.log('   - Replace "your_actual_supabase_anon_key_here" with your real key')
  console.log('   - Restart the development server')
} else {
  try {
    fs.copyFileSync(templatePath, envPath)
    console.log('✅ .env.local file created successfully!')
    console.log('')
    console.log('📋 Next steps:')
    console.log('1. Open .env.local')
    console.log('2. Replace "your_actual_supabase_anon_key_here" with your Supabase anon key')
    console.log('3. Restart the development server: npm run dev')
    console.log('')
    console.log('🔑 To get your Supabase key:')
    console.log('   - Go to your Supabase project dashboard')
    console.log('   - Navigate to Settings → API')
    console.log('   - Copy the "anon public" key')
  } catch (error) {
    console.error('❌ Failed to create .env.local file:', error.message)
  }
}
