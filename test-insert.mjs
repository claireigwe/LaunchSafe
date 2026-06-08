import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import crypto from 'crypto';

const env = fs.readFileSync('.env.local', 'utf8');
let SUPABASE_URL = '';
let SUPABASE_SERVICE_ROLE_KEY = '';

env.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) SUPABASE_URL = line.split('=')[1].trim();
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) SUPABASE_SERVICE_ROLE_KEY = line.split('=')[1].trim();
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testInsert() {
  const { data: businesses } = await supabase.from('businesses').select('id, user_id').limit(1);
  if (!businesses || businesses.length === 0) {
    console.log("No businesses found");
    return;
  }
  
  const b = businesses[0];
  const docId = crypto.randomUUID();
  
  const payload = JSON.stringify({
    description: "test",
    docType: "other",
    file_name: "test.pdf",
    file_size: 1000,
    file_type: "application/pdf"
  });

  const { data: doc, error: insertError } = await supabase
    .from("compliance_documents")
    .insert({
      id: docId,
      user_id: b.user_id,
      business_id: b.id,
      title: "Test",
      document_type: "report",
      status: "final",
      storage_path: null,
      content: payload
    })
    .select()
    .single();

  if (insertError) {
    console.error("Insert error:", insertError);
  } else {
    console.log("Success!");
  }
}

testInsert();
