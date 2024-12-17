import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const supabaseUrl = dotenv.config().parsed.SUPABASE_URL;
const supabaseKey = dotenv.config().parsed.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
