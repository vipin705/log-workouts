import Workout from './workout';

export default class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this._calPace();
    this._setDescrption();
  }

  _calPace() {
    return (this.pace = this.duration / this.distance);
  }
}
