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
    .order("created_at", { ascending: false })
    .limit(2);
  console.log("Documents:", JSON.stringify(data, null, 2));
}

test();
