import axios from 'axios';

const NEWS_RSS_URL = 'https://vnexpress.net/rss/bat-dong-san.rss';
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';

export const fetchNews = async () => {
  try {
    const response = await axios.get(RSS_TO_JSON_API, {
      params: {
        rss_url: NEWS_RSS_URL
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return { items: [] };
  }
};
