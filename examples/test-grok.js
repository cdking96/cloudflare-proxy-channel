const grokApiKey = process.env.GROK_API_KEY || 'YOUR_GROK_API_KEY';
const workerUrl = 'https://channel.xxxxx.workers.dev';

async function testGrok() {
  console.log('Testing Grok API through Cloudflare Worker...');

  try {
    const response = await fetch(`${workerUrl}/grok/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-beta',
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

testGrok();
