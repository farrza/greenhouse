import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBgF9Xpnr5bB855xSEXT3DtLiBZ9GKCaWg",
  authDomain: "greenhouse-32d10.firebaseapp.com",
  databaseURL:
    "https://greenhouse-32d10-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "greenhouse-32d10",
  storageBucket: "greenhouse-32d10.appspot.com",
  messagingSenderId: "773937109201",
  appId: "1:773937109201:web:e87abeb85ec7c7fa974df0",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DATABASE OPERATIONS

const root = ref(db, "/");
onValue(root, (snapshot) => {
  const data = snapshot.val();
  displaySensorValues(data);
});

function updateSensorValue(sensor, id, value) {
  set(ref(db, `${sensor}/`), {
    value: value,
    id: id,
  });
}

function displaySensorValues(sensorData) {
  for (const [key, value] of Object.entries(sensorData)) {
    const formInput = document.getElementById(key);
    const formValue = document.getElementById(value.id);
    formInput.innerHTML = value.value;
    formValue.innerHTML = value.value;

    const defaultValue = formInput.value;
    if (value.value > defaultValue) {
      formInput.stepUp(value.value - defaultValue);
    } else if (value.value < defaultValue) {
      formInput.stepDown(defaultValue - value.value);
    }
  }
}

// SENSOR SETUP

function setupSensor(sensor, formValue) {
  sensor.oninput = function () {
    formValue.innerHTML = this.value;
  };

  sensor.onmouseup = function () {
    updateSensorValue(sensor.id, formValue.id, this.value);
  };

  sensor.ontouchend = function () {
    updateSensorValue(sensor.id, formValue.id, this.value);
  };
}

const sensors = document.getElementsByClassName("slidecontainer");
for (const sensor of sensors) {
  const sensorInput = sensor.getElementsByTagName("input")[0];
  const sensorFormValue = sensor.getElementsByTagName("span")[0];
  setupSensor(sensorInput, sensorFormValue);
}
