import {
  createSignal,
  createEffect,
  onMount,
  onCleanup,
  useContext,
} from "solid-js";
import mapboxgl from "mapbox-gl";
import type { DroneType, ZoomToType } from "../types";
import { addStations, addDrone, MapDataContext } from "../helpers";

import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";

type MapProps = {
  zoomTo?: ZoomToType;
};

export const Map = (props: MapProps) => {
  const { availableStations, emergencies, deployedDrones } =
    useContext(MapDataContext);

  const INITIAL_CENTER: [number, number] = [-122.1164, 47.664];
  const INITIAL_BOUNDS: [number, number, number, number] = [
    -122.25, 47.5, -122, 47.75,
  ];
  const INITIAL_ZOOM = 12.5;

  const [displayData, setDisplayData] = createSignal(false);
  const [center, setCenter] = createSignal<[number, number]>(INITIAL_CENTER);
  const [zoom, setZoom] = createSignal(INITIAL_ZOOM);

  let mapContainerRef: HTMLDivElement | undefined;
  let mapInstance: mapboxgl.Map | null = null;
  const droneMarkers: any = [];
  const emergencyMarkers: any = [];

  const zoomToLocation = ({ location, zoom }: ZoomToType) => {
    if (mapInstance) {
      mapInstance.flyTo({
        center: location,
        zoom: zoom,
        bearing: 0,
      });
    }
  };

  onMount(() => {
    const MAP_API = import.meta.env.VITE_MAP_API;
    mapboxgl.accessToken = MAP_API;
    if (mapContainerRef) {
      mapInstance = new mapboxgl.Map({
        container: mapContainerRef,
        style: "mapbox://styles/mapbox/dark-v11",
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
        maxBounds: INITIAL_BOUNDS,
        minZoom: 6,
        maxZoom: 20,
        bearing: 0,
        dragRotate: true,
        touchPitch: false,
      });

      mapInstance.on("move", () => {
        if (mapInstance) {
          const mapCenter = mapInstance.getCenter();
          const mapZoom = mapInstance.getZoom();

          setCenter([mapCenter.lng, mapCenter.lat]);
          setZoom(mapZoom);
        }
      });

      mapInstance.on("click", (e) => {
        e.preventDefault();
      });

      mapInstance.on("load", () => {
        setDisplayData(true);
      });
    }
  });

  createEffect(() => {
    if (displayData() && mapInstance && availableStations()) {
      addStations(mapInstance, availableStations());
    }
  });

  createEffect(() => {
    if (displayData() && mapInstance && emergencies()) {
      // When an emergency is either added or removed, make sure we start fresh
      if (emergencyMarkers.length > 0) {
        for (let i = 0; i < emergencyMarkers.length; i++) {
          emergencyMarkers[i].remove();
        }
      }

      // Add any new emergencies
      if (emergencies().length > 0) {
        for (let i = 0; i < emergencies().length; i++) {
          const emergency = emergencies()[i];
          const el = document.createElement("div");
          el.id = `emergency-${emergency.id}`;
          el.className = "emergency";

          const newEmergency = new mapboxgl.Marker(el)
            .setLngLat(emergency.location)
            .addTo(mapInstance);

          emergencyMarkers.push(newEmergency);
        }
      }
    }
  });

  createEffect(() => {
    if (displayData() && mapInstance && deployedDrones()) {
      for (let i = 0; i < deployedDrones().length; i++) {
        const drone = deployedDrones()[i] as DroneType;
        if (drone && drone.status.deployed) {
          // this drone is deployed. Update location
          if (droneMarkers[drone.id] && drone.status.currentLocation) {
            // Use requestAnimationFrame to batch updates
            requestAnimationFrame(() => {
              droneMarkers[drone.id].setLngLat(drone.status.currentLocation);
            });

            if (drone.status.headingTo?.name === drone.stationAssigned) {
              // If the drone is heading home, remove animated line path on map
              if (mapInstance.getLayer(`line-layer-${drone.id}`))
                mapInstance.removeLayer(`line-layer-${drone.id}`);
            }
          } else if (drone.status.currentLocation) {
            // add this drone to our map
            const el = document.createElement("div");
            el.id = `drone-${drone.id}`;
            el.className = "drone";

            const newMarker = new mapboxgl.Marker(el)
              .setLngLat(drone.status.currentLocation)
              .addTo(mapInstance);
            droneMarkers[drone.id] = newMarker;
            if (drone.status.headingTo?.location) {
              addDrone(
                mapInstance,
                drone.id,
                drone.status.currentLocation,
                drone.status.headingTo?.location
              );
            }
          }
        } else {
          // this drone is not deployed, so make sure it isn't in our map
          if (drone) {
            if (droneMarkers[drone.id]) droneMarkers[drone.id].remove();
            if (mapInstance.getLayer(`line-layer-${drone.id}`))
              mapInstance.removeLayer(`line-layer-${drone.id}`);
            if (mapInstance.getSource(`line-${drone.id}`))
              mapInstance.removeSource(`line-${drone.id}`);
            delete droneMarkers[drone.id];
          }
        }
      }
    }
  });

  createEffect(() => {
    if (displayData() && props.zoomTo?.location) {
      zoomToLocation(props.zoomTo);
    }
  });

  onCleanup(() => {
    if (mapInstance) mapInstance.remove();
    setDisplayData(false);
  });

  return (
    <>
      <div id="Map">
        <div class="sidebar">
          Longitude: {center()[0].toFixed(4)} | Latitude:{" "}
          {center()[1].toFixed(4)} | Zoom: {zoom().toFixed(2)}
        </div>
        <button
          class="reset-button"
          onClick={() => {
            zoomToLocation({ location: INITIAL_CENTER, zoom: INITIAL_ZOOM });
          }}
        >
          Reset
        </button>
        <div
          ref={(el) => (mapContainerRef = el as HTMLDivElement)}
          style={{ width: "100%" }}
          class="map-container"
        />
      </div>
    </>
  );
};
