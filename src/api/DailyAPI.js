import Request from './Request';

class DailyAPI {
  constructor() {
    this._fetch = new Request();
  }

  _buildURL(path) {
    return `https://api.daily.co/v1${path}`;
  }

  async getRooms() {
    return this._fetch.read(this._buildURL('/rooms'));
  }

  async createNewRoom(name) {
    return this._fetch.create(
      this._buildURL('/rooms', {
        name,
        privacy: 'private',
      }),
    );
  }
}

export default new DailyAPI();
