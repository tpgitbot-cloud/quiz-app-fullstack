import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Supabase configuration from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client
// If variables are missing, client creation will log a warning but the app won't crash until a request is made
const supabase = (supabaseUrl && supabaseKey) 
    ? createClient(supabaseUrl, supabaseKey)
    : null;

// Middleware to check if Supabase is configured
const checkSupabase = (req, res, next) => {
    if (!supabase) {
        console.warn("Supabase is not configured. Data will not be persisted.");
        return res.json([]); // Return empty list or successful mock response
    }
    next();
};

app.get('/api/status', (req, res) => {
    res.json({
        supabaseConnected: !!supabase,
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/results', checkSupabase, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('results')
            .select('*')
            .order('timestamp', { ascending: false });
        
        if (error) throw error;
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/results', checkSupabase, async (req, res) => {
    try {
        const { error } = await supabase
            .from('results')
            .insert([req.body]);
        
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/results', checkSupabase, async (req, res) => {
    try {
        const { error } = await supabase
            .from('results')
            .delete()
            .neq('name', '___impossible_name___'); // Supabase requires a filter for delete
        
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/violations', checkSupabase, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('violations')
            .select('*')
            .order('timestamp', { ascending: false });
        
        if (error) throw error;
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/violations', checkSupabase, async (req, res) => {
    try {
        const { error } = await supabase
            .from('violations')
            .insert([req.body]);
        
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/violations', checkSupabase, async (req, res) => {
    try {
        const { error } = await supabase
            .from('violations')
            .delete()
            .neq('student', '___impossible_student___');
        
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default app;



