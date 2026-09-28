// Если переменная окружения не задана, используем стандартный URL Яндекс Практикума
const API_ORIGIN = process.env.API_ORIGIN || 'https://ya-praktikum.tech';

export const API_URL = `${API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${API_ORIGIN}/content/weblarek`;

export const settings = {};