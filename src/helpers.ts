import { createContext } from "solid-js";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import type { LocationType, StationType } from "./types";

type DebounceType = {
  func: (...args: any[]) => void;
  delay: number;
};

export const MapDataContext = createContext<any>();

export const colors = {
  blueLight: "#00D2FF",
  blueDark: "#2F6C79",
  greenLight: "#039955",
  greenDark: "#006134",
  orangeLight: "#DD6705",
  orangeDark: "#933A0E",
  redLight: "#D73020",
  redDark: "#943534",
};

export const debounce = ({ func, delay }: DebounceType) => {
  let timer: number;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/**
 * Returns the endpoint URL for the API based on the environment.
 * @returns {string} The endpoint URL for the API.
 */
export const getEndpoint = () => {
  const env = import.meta.env.PROD;
  const endpoint = env
    ? import.meta.env.VITE_PROD_ENDPOINT
    : "http://localhost:3001";
  return endpoint;
};

export const addStations = (
  mapInstance: mapboxgl.Map,
  stations: StationType[]
) => {
  for (let i = 0; i < stations.length; i++) {
    const stationId = stations[i].id;
    const el = document.createElement("div");
    el.id = `station-${stationId}`;
    el.className = "station";

    const circleLocation: [number, number] = [
      stations[i].location.lng,
      stations[i].location.lat,
    ];
    const circle = turf.circle(circleLocation, 1.5, {
      steps: 40,
      units: "miles",
    });

    // Add a source for the circle
    mapInstance.addSource(`circle-${stationId}`, {
      type: "geojson",
      data: circle,
    });

    // Add a layer to display the circle
    mapInstance.addLayer({
      id: `circle-layer-${stationId}`,
      type: "line",
      source: `circle-${stationId}`,
      slot: "top",
      layout: {},
      paint: {
        "line-color": colors.blueLight,
        "line-width": 1,
        "line-opacity": 0.33,
      },
    });

    new mapboxgl.Marker({
      anchor: "bottom",
      element: el,
    })
      .setLngLat(stations[i].location)
      .addTo(mapInstance);
  }
};

export const addDrone = (mapInstance: mapboxgl.Map, droneId: string, startLoc: LocationType, endLoc: LocationType) => {
  const line = turf.lineString(
    [[startLoc.lng, startLoc.lat], [endLoc.lng, endLoc.lat]],
    { units: "miles" }
  );

  mapInstance.addSource(`line-${droneId}`, {
    type: "geojson",
    data: line,
  });

  mapInstance.addLayer({
    id: `line-layer-${droneId}`,
    type: "line",
    source: `line-${droneId}`,
    slot: "top",
    layout: {},
    paint: {
      "line-color": colors.blueLight,
      "line-width": 1,
      "line-dasharray": [0, 1, 5, 9],
    },
  });

  const dashArraySequence = [
    [0, 1, 5, 9],
    [0, 2, 5, 8],
    [0, 3, 5, 7],
    [0, 4, 5, 6],
    [0, 5, 5, 5],
    [0, 6, 5, 4],
    [0, 7, 5, 3],
    [0, 8, 5, 2],
    [0, 9, 5, 1],
    [1, 10, 4],
    [2, 10, 3],
    [3, 10, 2],
    [4, 10, 1],
    [5, 10, 0],
  ];

  let step = 0;
  const animateDashArray = () => {
    setTimeout(() => {
      if (mapInstance.getLayer(`line-layer-${droneId}`)) {
        mapInstance.setPaintProperty(
          `line-layer-${droneId}`,
          "line-dasharray",
          dashArraySequence[step]
        );
        requestAnimationFrame(animateDashArray)
      }
    }, 200);
    if (step === dashArraySequence.length - 1) {
      step = 0;
    } else {
      step += 1;
    }
  }
  animateDashArray()
};
