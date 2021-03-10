class ApiService {
  api = 'https://api.themoviedb.org/3/';

  key = 'b14771c0adfdc54f59204d41d5bf2302';

  mainFetch = async (url, options) => {
    try {
      const request = await fetch(url, options);
      return await request.json();
    } catch (err) {
      throw new Error(err);
    }
  };

  getGenres = (fn) => {
    this.mainFetch(`${this.api}genre/movie/list?api_key=${this.key}&language=en-US`).then((data) => fn(data.genres));
  };

  sendRequest = (value, page) =>
    this.mainFetch(`${this.api}search/movie?api_key=${this.key}&query=${value}&page=${page}`);

  sendRate = (rateFromCard, id) => {
    localStorage.setItem('rate', rateFromCard);
    this.mainFetch(
      `${this.api}movie/${id}/rating?api_key=${this.key}&guest_session_id=${localStorage.getItem('session_id')}`,
      {
        method: 'POST',
        body: JSON.stringify({ value: rateFromCard }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
  };

  getSession = () => {
    this.mainFetch(`${this.api}authentication/guest_session/new?api_key=${this.key}`).then((data) =>
      localStorage.setItem('session_id', data.guest_session_id)
    );
  };

  sendRequestRated = () => this.mainFetch(
      `${this.api}guest_session/${localStorage.getItem('session_id')}/rated/movies?api_key=${this.key}`
    );
}

export default ApiService;
