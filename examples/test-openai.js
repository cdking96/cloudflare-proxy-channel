const openaiApiKey = process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY';
const workerUrl = 'https://channel.xxxxx.workers.dev';

async function testOpenAI() {
  console.log('Testing OpenAI API through Cloudflare Worker...');

  try {
    const response = await fetch(`${workerUrl}/openai/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'Hello, can you introduce yourself briefly?'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Success! Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

testOpenAI();
