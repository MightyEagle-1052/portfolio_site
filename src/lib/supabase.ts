import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://lkujecqcqlaookvfkhxv.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjM3NzE3NTMzLTVlMWQtNDQ2Ny04MTQxLTIwM2Q2MWQ5OWI1ZiJ9.eyJwcm9qZWN0SWQiOiJsa3VqZWNxY3FsYW9va3Zma2h4diIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzkzODc4OTg4LCJleHAiOjIxMDkyMzg5ODgsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.V9Wh16q-lAFmhsD-GpxuTfYltFGE4kZ15oA5FQqCi10';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };