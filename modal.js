import { reject, resolve } from 'q';
import { async } from 'regenerator-runtime';
import Cycling from './Workouts/cycling.js';
import Running from './Workouts/running.js';

export const workouts = [];

export const getCurrentUserLocation = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      resolve({
        latitude,
        longitude,
      });
    }, reject);
  });
};

export const addWorkoutData = function (
  coords,
  type,
  distance,
  duration,
  effort
) {
  const newWorkout =
    type === 'running'
      ? new Running(coords, distance, duration, effort)
      : new Cycling(coords, distance, duration, effort);
  workouts.push(newWorkout);
};

export const storeWorkouts = function () {
  localStorage.setItem('workout', JSON.stringify(workouts));
};

export const getStoredWorkouts = function () {
  const data = JSON.parse(localStorage.getItem('workout')).map(workout => {
    workout.type === 'running'
      ? Object.setPrototypeOf(workout, Running.prototype)
      : Object.setPrototypeOf(workout, Cycling.prototype);
      workouts.push(workout)
      return workout;
  });
  return data;
};
