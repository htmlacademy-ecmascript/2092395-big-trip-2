import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return ApiService.parseResponse(response);
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return ApiService.parseResponse(response);
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      'base_price': Number(point.basePrice),
      'date_from': new Date(point.dateFrom).toISOString(),
      'date_to': new Date(point.dateTo).toISOString(),
      'destination': point.destination,
      'id': point.id,
      'is_favorite': Boolean(point.isFavorite),
      'offers': point.offers || [],
      'type': point.type
    };

    // Удаляем временный ID для новых точек
    if (point.id && point.id.startsWith('new-')) {
      delete adaptedPoint.id;
    }

    return adaptedPoint;
  }
}
