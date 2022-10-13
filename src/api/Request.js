class Request {
  constructor() {
    this.dailyApiToken = process.env.DAILY_API_TOKEN;
  }

  async _fetch(url, options) {
    return fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.dailyApiToken}`,
      },
      ...options,
    }).then((resp) => resp.json());
  }

  async _parseData(body) {
    if (!body) {
      return {};
    }

    return {
      body: JSON.stringify(body),
    };
  }

  async create(url, data) {
    return this._fetch(url, {
      method: 'POST',
      ...this._parseData(data),
    });
  }

  async read(url) {
    return this._fetch(url);
  }

  async update(url, data) {
    return this._fetch(url, {
      method: 'PUT',
      ...this._parseData(data),
    });
  }

  async delete(url, data) {
    return this._fetch(url, {
      method: 'DELETE',
      ...this._parseData(data),
    });
  }
}

export default Request;
