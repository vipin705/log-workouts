import Workout from './workout';

export default class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this._calSpeed();
    this._setDescrption();
  }

  _calSpeed() {
    return (this.speed = this.distance / (this.duration / 60));
  }
}
