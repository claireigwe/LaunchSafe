import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envFile = fs.readFileSync(".env.local", "utf-8");
const parseEnv = (key) => {
  const match = envFile.match(new RegExp(`${key}="?(.*?)"?(?:\\r?\\n|$)`));
  return match ? match[1] : null;
};

const supabaseUrl = parseEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabaseKey = parseEnv("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from("compliance_documents")
    .select("*")
    .not("storage_path", "is", null)
    .order("created_at", { ascending: false })
    .limit(1);
  console.log("Documents:", data);

  if (data && data.length > 0) {
    const { data: urlData, error: urlError } = await supabase.storage
      .from("compliance-documents")
      .createSignedUrl(data[0].storage_path, 86400, { download: true });
    console.log("URL:", urlData?.signedUrl);
    console.log("URL Error:", urlError);
  }
}

test();
