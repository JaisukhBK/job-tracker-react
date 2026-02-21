import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qaetwdpbqmowlnnyyvuc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZXR3ZHBicW1vd2xubnl5dnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MDMwNjEsImV4cCI6MjA4NzE3OTA2MX0.zfyRR64isumiNN5KuHPGZMEp9d1NF5WP58eBti9NYvw';

export const supabase = createClient(supabaseUrl, supabaseKey);