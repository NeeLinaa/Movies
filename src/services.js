import { saveRate } from './localStorages';

class ApiService {
  api = 'https://api.themoviedb.org/3/';

  key = 'b14771c0adfdc54f59204d41d5bf2302';

  rate = localStorage.getItem('session_id');

  sessionId = localStorage.getItem('session_id');

  mainFetch = async (url, options) => {
    try {
      const request = await fetch(url, options);
      if (!request.ok) throw new Error(`Error: ${request.status}`);
      const resp = await request.json();
      return resp;
    } catch (err) {
      throw new Error(err);
    }
  };

  getGenres = (fn) =>
    this.mainFetch(`${this.api}genre/movie/list?api_key=${this.key}&language=en-US`).then((data) => fn(data.genres));

  sendRequest = (value, page) =>
    this.mainFetch(`${this.api}search/movie?api_key=${this.key}&query=${value}&page=${page}`);

  sendRate = (rateFromCard, id) => {
    saveRate(rateFromCard);
    this.mainFetch(`${this.api}movie/${id}/rating?api_key=${this.key}&guest_session_id=${this.rate}`, {
      method: 'POST',
      body: JSON.stringify({ value: rateFromCard }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  };

  getSession = () => this.mainFetch(`${this.api}authentication/guest_session/new?api_key=${this.key}`);

  sendRequestRated = () =>
    this.mainFetch(`${this.api}guest_session/${this.sessionId}/rated/movies?api_key=${this.key}`);
}

export default ApiService;
