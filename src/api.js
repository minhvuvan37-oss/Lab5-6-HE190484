import axios from 'axios';

// json-server chạy ở cổng 3001 (npm run server), React chạy ở cổng 3000
const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export default api;
