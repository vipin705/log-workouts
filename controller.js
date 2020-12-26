import { async } from 'q';
import * as modal from './modal.js';
import mapView from './Views/mapView.js';

const getCoords = async function () {
  try {
    const cords = await modal.getCurrentUserLocation();
    mapView.displayMap(cords);
  } catch (err) {
    console.log(err.message);
  }
};

const createWorkoutType = function (coords, type, distance, duration, effort) {
  modal.addWorkoutData(coords, type, distance, duration, effort);
  const workout = modal.workouts[modal.workouts.length - 1];
  mapView.renderWorkout(workout);
  modal.storeWorkouts();
};

const init = async function () {
  await getCoords();
  if (modal.getStoredWorkouts()) {
    modal.getStoredWorkouts().forEach(workout => {
      mapView.renderWorkout(workout);
    });
  }
  mapView.displayFormOnClick();
  mapView.displayWorkoutOnSubmit(createWorkoutType);
  mapView.toggleEffortOnType();
  mapView.panToWorkout(modal.workouts);
};

init();
