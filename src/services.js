class ApiService {
  api = 'https://api.themoviedb.org/3/';

  key = 'b14771c0adfdc54f59204d41d5bf2302';

  getGenres = (fn) => {
    fetch(`${this.api}genre/movie/list?api_key=${this.key}&language=en-US`)
      .then((response) => response.json())
      .then((data) => fn(data.genres));
  };

  sendRequest = (value, page, funcError, fnArray, fnLoading) => {
    fetch(`${this.api}search/movie?api_key=${this.key}&query=${value}&page=${page}`)
      .then((resp) => resp.json())
      .then((rez) => {
        fnArray(rez.results);
        fnLoading(false);
      })
      .catch(funcError);
  };

  sendRate = (rateFromCard, id) => {
    localStorage.setItem('rate', rateFromCard);
    fetch(`${this.api}movie/${id}/rating?api_key=${this.key}&guest_session_id=${localStorage.getItem('session_id')}`, {
      method: 'POST',
      body: JSON.stringify({ value: rateFromCard }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  };

  getSession = () => {
    fetch(`${this.api}authentication/guest_session/new?api_key=${this.key}`)
      .then((resp) => resp.json())
      .then((data) => localStorage.setItem('session_id', data.guest_session_id));
  };

  sendRequestRated = (funcArray, funcLoading, funcError) => {
    fetch(`${this.api}guest_session/${localStorage.getItem('session_id')}/rated/movies?api_key=${this.key}`)
      .then((resp) => resp.json())
      .then((rez) => {
        funcArray(rez.results);
        funcLoading(false);
      })
      .catch(funcError);
  };
}

export default new ApiService();
