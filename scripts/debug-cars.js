const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fzvlzdouefwwvqewuztg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dmx6ZG91ZWZ3d3ZxZXd1enRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNDUzODYsImV4cCI6MjA4NTcyMTM4Nn0.YGHzHIOvvyCqBDC0h8_9xaTGJFwpIxewXuiO2fyqr1w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getCars() {
    const { data, error } = await supabase
        .from('cars')
        .select('id, title, images');

    if (error) {
        console.error('Error fetching cars:', error);
        return;
    }

    console.log('Cars found:', data.length);
    data.forEach(car => {
        console.log(`Car ID: ${car.id}`);
        console.log(`Title: ${car.title}`);
        console.log(`Images:`, JSON.stringify(car.images, null, 2));
        console.log('-----------------------------------');
    });
}

getCars();
