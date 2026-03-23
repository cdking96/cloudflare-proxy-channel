import { Router } from 'itty-router';

const router = Router();

const AI_SERVICES = {
  openai: {
    baseUrl: 'https://api.openai.com',
    pathPrefix: '/openai'
  },
  grok: {
    baseUrl: 'https://api.x.ai',
    pathPrefix: '/grok'
  },
  gimini: {
    baseUrl: 'https://generativelanguage.googleapis.com',
    pathPrefix: '/gimini'
  }
};

const ALLOWED_HEADERS = ['Authorization', 'Content-Type', 'x-goog-api-key'];

// 通用代理函数
async function proxyRequest(request, targetUrl) {
  const url = new URL(request.url);
  const finalUrl = `${targetUrl}${url.search}`;

  const headers = {};

  ALLOWED_HEADERS.forEach(headerName => {
    const value = request.headers.get(headerName);
    if (value) {
      headers[headerName] = value;
    }
  });

  const response = await fetch(finalUrl, {
    method: request.method,
    headers: headers,
    body: request.body
  });

  return response;
}

Object.entries(AI_SERVICES).forEach(([serviceName, config]) => {
  router.all(`${config.pathPrefix}/*`, async (request) => {
    const url = new URL(request.url);
    const path = url.pathname.replace(config.pathPrefix, '');
    const targetUrl = `${config.baseUrl}${path}`;
    return proxyRequest(request, targetUrl);
  });
});

router.get('/health', () => {
  return new Response(JSON.stringify({
    status: 'ok',
    services: Object.keys(AI_SERVICES),
    timestamp: new Date().toISOString()
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
});

router.get('/services', () => {
  return new Response(JSON.stringify({
    services: Object.entries(AI_SERVICES).map(([name, config]) => ({
      name,
      baseUrl: config.baseUrl,
      pathPrefix: config.pathPrefix,
      example: `https://channel.xxxxx.workers.dev${config.pathPrefix}/v1/chat/completions`
    }))
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
});

router.all('*', () => {
  return new Response(JSON.stringify({
    error: 'Not Found',
    availableEndpoints: ['/health', '/services', ...Object.values(AI_SERVICES).map(s => s.pathPrefix)]
  }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json'
    }
  });
});

export default {
  fetch: router.handle
};
