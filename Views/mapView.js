import L from 'leaflet';
import {ZOOM_LEVEL} from '../config.js'

class MapView {
  _map;
  _position;
  _containerWorkouts = document.querySelector('.workouts');
  _form = document.querySelector('.form');
  _inputDistance = document.querySelector('.form__input--distance');
  _inputDuration = document.querySelector('.form__input--duration');
  _inputCadence = document.querySelector('.form__input--cadence');
  _inputElevation = document.querySelector('.form__input--elevation');
  _inputType = document.querySelector('.form__input--type');

  _clearInputFields() {
    this._inputType.value = this._inputDistance.value = this._inputDuration.value = this._inputCadence.value =
      '';
    this._inputDistance.focus();
  }

  displayMap(coords) {
    const { latitude, longitude } = coords;
    this._map = L.map('map').setView([latitude, longitude], ZOOM_LEVEL);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);
  }

  displayFormOnClick() {
    this._map.on('click', e => {
      const { lat, lng } = e.latlng;
      this._position = {
        lat,
        lng,
      };
      this._form.classList.remove('hidden');
      this._inputDistance.focus();
    });
  }

  displayWorkoutOnSubmit(handler) {
    this._form.addEventListener('submit', e => {
      e.preventDefault();
      const { lat, lng } = this._position;
      const data = this._getWorkoutData();
      this._clearInputFields();
      if (!data) return;
      handler([lat, lng], ...data);
    });
  }

  toggleEffortOnType() {
    this._inputType.addEventListener('change', () => {
      this._inputElevation
        .closest('.form__row')
        .classList.toggle('form__row--hidden');
      this._inputCadence
        .closest('.form__row')
        .classList.toggle('form__row--hidden');
    });
  }

  _getWorkoutData() {
    const type = this._inputType.value;
    const distance = +this._inputDistance.value;
    const duration = +this._inputDuration.value;
    if (!Number.isFinite(distance) || !Number.isFinite(duration)) return;
    const effort =
      type === 'running'
        ? +this._inputCadence.value
        : +this._inputElevation.value;

    return [type, distance, duration, effort];
  }

  renderWorkout(workout) {
    const markUp = this._generateMarkUp(workout);
    this._form.insertAdjacentHTML('afterend', markUp);
    this._hideForm();
    const popUpOptions = {
      autoClose: false,
      autoPan: true,
      className: `${workout.type}-popup`,
      closeOnClick: false,
      maxWidth: 250,
      minWidth: 100,
    };
    L.marker(workout.coords)
      .addTo(this._map)
      .bindPopup(L.popup(popUpOptions))
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _generateMarkUp(workout) {
    return `      
    <<li class="workout workout--${workout.type}" data-id=${workout.id}>
      <h2 class="workout__title">${workout.description}</h2>
      <div class="workout__details">
        <span class="workout__icon">${
          workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
        }</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${
          workout.type === 'running' ? workout.pace.toFixed(1) : workout.speed
        }</span>
        <span class="workout__unit">${
          workout.type === 'running' ? 'min/km' : ' km/h'
        }</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">${
          workout.type === 'running' ? '🦶🏼' : '⛰'
        }</span>
        <span class="workout__value">${
          workout.type === 'running' ? workout.cadence : workout.elevation
        }</span>
        <span class="workout__unit">${
          workout.type === 'running' ? 'spm' : 'm'
        }</span>
      </div>
    </li>`;
  }

  _hideForm() {
    this._inputType.value = this._inputDistance.value = this._inputDuration.value = this._inputCadence.value =
      '';
    this._form.display = 'none';
    this._form.classList.add('hidden');
    setTimeout(() => {
      this._form.display = 'grid';
    }, 1000);
  }

  panToWorkout(workouts) {
    this._containerWorkouts.addEventListener('click', e => {
      const el = e.target.closest('.workout');
      if (!el) return;
      const workout = workouts.find(work => work.id === el.dataset.id);
      this._map.setView(workout.coords, ZOOM_LEVEL,{
          animate: true,
          pan:{
              duration: 1
          }
      });
    });
  }
}

export default new MapView();
