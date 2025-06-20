
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

async function generateEmbedding(text: string) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    }),
  });

  const data = await response.json();
  return data.data[0].embedding;
}

async function retrieveRelevantChunks(query: string, matchCount: number = 5) {
  const queryEmbedding = await generateEmbedding(query);
  
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: JSON.stringify(queryEmbedding),
    match_threshold: 0.78,
    match_count: matchCount,
  });

  if (error) {
    console.error('Error retrieving chunks:', error);
    return [];
  }

  return data || [];
}

async function getUserContext(authToken: string) {
  const authClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  // Set the auth token
  await authClient.auth.setSession({
    access_token: authToken,
    refresh_token: '',
  });

  // Get user profile
  const { data: profile } = await authClient
    .from('profiles')
    .select('*')
    .single();

  // Get user's school list
  const { data: schools } = await authClient
    .from('user_school_lists')
    .select('name, status, application_type')
    .limit(5);

  return { profile, schools };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get auth token from headers
    const authToken = req.headers.get('authorization')?.replace('Bearer ', '');
    let userContext = null;

    if (authToken) {
      try {
        userContext = await getUserContext(authToken);
      } catch (error) {
        console.log('Could not fetch user context:', error.message);
      }
    }

    // Retrieve relevant chunks
    const relevantChunks = await retrieveRelevantChunks(message);
    
    // Build context from chunks
    const context = relevantChunks
      .map(chunk => chunk.content)
      .join('\n\n');

    // Create system prompt with context and user info
    let systemPrompt = `You are an AI assistant specializing in college admissions advice. You have access to relevant information from college admissions guides and resources.

CONTEXT FROM KNOWLEDGE BASE:
${context}

Your role is to provide helpful, accurate, and personalized college admissions advice. Always base your responses on the provided context when relevant, but also use your general knowledge about college admissions.

Guidelines:
- Be encouraging and supportive
- Provide specific, actionable advice
- If you don't have specific information in the context, say so and provide general guidance
- Always encourage students to verify information with official sources`;

    if (userContext?.profile) {
      systemPrompt += `\n\nUSER PROFILE INFORMATION:
- Name: ${userContext.profile.full_name || 'Not provided'}
- GPA (Unweighted): ${userContext.profile.gpa_unweighted || 'Not provided'}
- GPA (Weighted): ${userContext.profile.gpa_weighted || 'Not provided'}
- SAT/ACT Score: ${userContext.profile.sat_act_score || 'Not provided'}
- High School: ${userContext.profile.high_school || 'Not provided'}`;
    }

    if (userContext?.schools && userContext.schools.length > 0) {
      systemPrompt += `\n\nUSER'S SCHOOL LIST:
${userContext.schools.map(school => `- ${school.name} (Status: ${school.status}, Type: ${school.application_type})`).join('\n')}`;
    }

    // Prepare conversation for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({
        response: aiResponse,
        context_used: relevantChunks.length > 0,
        sources_count: relevantChunks.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in rag-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
