import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zaktodpswwimkrcjzanb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpha3RvZHBzd3dpbWtyY2p6YW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MzQ3MzEsImV4cCI6MjA4ODExMDczMX0.JMPwK5UFCBuNqc818pKsx5X8fNNZG_HMqWSXRyrk7Ks';

export const supabase = createClient(supabaseUrl, supabaseKey);