import type { DataType, DroneType } from "./types";

export const mockDroneData: DroneType = {
  id: "responder-1",
  stationAssigned: "station-3",
  status: {
      readyToBeDeployed: true,
    currentLocation: {
      lat: 47.674481,
      lng: -122.13732,
    },
    health: "good",
    headingTo: {
      name: ""
    },
    deployed: true,
    charging: false,
    batteryLife: "98%",
    eta: "",
    currentSpeed: 15,
  },
};

export const mockData: DataType = {
  emergencies: [
    {
      id: "emergency-1",
      type: "emergency",
      location: {
        lat: 47.66724,
        lng: -122.143777,
      },
      notes: "Child fainted. Need XYZ medicine asap",
    },
  ],
  availableDrones: [
    {
      id: "responder-1",
      stationAssigned: "station-1",
      status: {
      readyToBeDeployed: false,
        currentLocation: {
          lat: 47.648351,
          lng: -122.111187,
        },
        health: "bad",
        deployed: false,
        charging: true,
        batteryLife: "10%",
      },
    },
    {
      id: "responder-2",
      stationAssigned: "station-1",
      status: {
      readyToBeDeployed: false,
        currentLocation: {
          lat: 47.648351,
          lng: -122.111187,
        },
        health: "good",
        deployed: false,
        charging: true,
        batteryLife: "80%",
      },
    },
    {
      id: "responder-3",
      stationAssigned: "station-2",
      status: {
      readyToBeDeployed: false,
        currentLocation: {
          lat: 47.666733,
          lng: -122.097563,
        },
        health: "warning",
        deployed: false,
        charging: false,
        batteryLife: "100%",
      },
    },
    {
      id: "responder-4",
      stationAssigned: "station-3",
      status: {
      readyToBeDeployed: true,
        currentLocation: {
          lat: 47.677694,
          lng: -122.133327,
        },
        health: "good",
        deployed: false,
        charging: false,
        batteryLife: "100%",
      },
    },
  ],
  availableStations: [
    {
      id: "station-1",
      type: "station",
      location: {
        lat: 47.648351,
        lng: -122.111187,
      },
    },
    {
      id: "station-2",
      type: "station",
      location: {
        lat: 47.666733,
        lng: -122.097563,
      },
    },
    {
      id: "station-3",
      type: "station",
      location: {
        lat: 47.677694,
        lng: -122.133327,
      },
    },
  ],
};
