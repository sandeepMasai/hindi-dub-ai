import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { text, targetLanguage = 'hi', sourceLanguage = 'en' } = await req.json()
    
    if (!text) {
      throw new Error('Text is required for translation')
    }

    console.log(`Translating from ${sourceLanguage} to ${targetLanguage}`)

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) {
      throw new Error('Lovable API key not configured')
    }

    // Use Lovable AI for translation with context preservation
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in movie and video dubbing. 
Your task is to translate English text to Hindi while:
1. Preserving the emotional tone and context
2. Maintaining cultural relevance for Indian audiences
3. Keeping similar sentence length for lip-sync compatibility
4. Using natural, conversational Hindi
5. Preserving any technical terms, names, or specific terminology appropriately

Only return the translated text, nothing else.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Lovable AI error:', errorText)
      throw new Error(`Translation API error: ${response.status}`)
    }

    const data = await response.json()
    const translation = data.choices?.[0]?.message?.content

    if (!translation) {
      throw new Error('No translation received from API')
    }

    console.log('Translation complete:', translation.substring(0, 100))

    return new Response(
      JSON.stringify({
        success: true,
        originalText: text,
        translatedText: translation,
        sourceLanguage,
        targetLanguage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in translate-text:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
