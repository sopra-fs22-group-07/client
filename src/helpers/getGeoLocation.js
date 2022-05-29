import {api} from "./api";

export const getGeoLocation = async (userId) => {

  // how to handle if we get user location
  const successCallback = async (position) => {
    await updateCoordinates(userId, position.coords.latitude, position.coords.longitude)
  };

  // how to handle if user denies access to location
  const errorCallback = async (error) => {
    console.log(`Error Message: ${error.message}`);
    window.alert("Your location could not be determined. You were set to the default location (0\"N, 0\"E).");
    await updateCoordinates(userId, 0, 0)
  };

  // if geolocation is not supported by the browser, do so
  if (!navigator.geolocation) {
    window.alert("Geolocation is not supported by your browser. You were set to the default location (0\"N, 0\"E).");
    await updateCoordinates(userId, 0, 0)
  } else {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }
}

async function updateCoordinates(userId, latitude, longitude) {
    await api.put(`/users/${userId}/location`, {
        latitude: latitude,
        longitude: longitude
    });
}