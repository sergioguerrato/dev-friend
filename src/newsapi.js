const BASE_URL = 'https://newsapi.org/v2';

async function fetchNews(params, endpoint = 'top-headlines') {
  const query = new URLSearchParams({ apiKey: process.env.NEWSAPI, ...params });
  const response = await fetch(`${BASE_URL}/${endpoint}?${query}`);

  if (!response.ok) {
    throw new Error(`NewsAPI error: ${response.status}`);
  }

  const { status, articles } = await response.json();

  if (status !== 'ok') {
    throw new Error('NewsAPI returned non-ok status');
  }

  const valid = articles.filter((a) => a.title && a.url && a.title !== '[Removed]');

  if (valid.length === 0) {
    throw new Error('Nenhum artigo encontrado');
  }

  return valid[Math.floor(Math.random() * valid.length)];
}

async function getTechNews() {
  return fetchNews({ category: 'technology', language: 'en', pageSize: 20 });
}

async function getGamingNews() {
  return fetchNews(
    { q: 'gaming OR playstation OR xbox OR nintendo OR "video game"', language: 'en', pageSize: 20, sortBy: 'publishedAt' },
    'everything'
  );
}

module.exports = { getTechNews, getGamingNews };
