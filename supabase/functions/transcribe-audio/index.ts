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
    const { audioUrl, language = 'en' } = await req.json()
    
    if (!audioUrl) {
      throw new Error('Audio URL is required')
    }

    console.log('Transcribing audio:', audioUrl)

    // Download audio from URL
    const audioResponse = await fetch(audioUrl)
    if (!audioResponse.ok) {
      throw new Error('Failed to fetch audio file')
    }

    const audioBlob = await audioResponse.blob()
    console.log('Audio file size:', audioBlob.size)

    // Prepare form data for OpenAI Whisper
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.mp3')
    formData.append('model', 'whisper-1')
    formData.append('language', language)
    formData.append('response_format', 'verbose_json')

    // Call OpenAI Whisper API
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    })

    if (!transcriptionResponse.ok) {
      const error = await transcriptionResponse.text()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${transcriptionResponse.status}`)
    }

    const transcription = await transcriptionResponse.json()
    console.log('Transcription complete:', transcription.text.substring(0, 100))

    return new Response(
      JSON.stringify({
        success: true,
        text: transcription.text,
        segments: transcription.segments,
        duration: transcription.duration,
        language: transcription.language,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in transcribe-audio:', error)
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
