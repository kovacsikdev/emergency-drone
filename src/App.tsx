import { createSignal, onMount, onCleanup } from "solid-js";
import { io, Socket } from "socket.io-client";
import type {
  DroneType,
  StationType,
  EmergencyType,
  ZoomToType,
  DroneDeployedLocationType
} from "./types";
import { Map } from "./components/Map";
import { Sidebar } from "./components/Sidebar";
import { DronesDeployed } from "./components/DronesDeployed";
import { getEndpoint, MapDataContext } from "./helpers";
import "./App.css";

function App() {
  const [availableStations, setAvailableStations] = createSignal<
    StationType[] | null
  >(null);
  const [availableDrones, setAvailableDrones] = createSignal<
    DroneType[] | null
  >(null);
  const [emergencies, setEmergencies] = createSignal<EmergencyType[] | null>(
    null
  );
  const [deployedDrones, setDeployedDrones] = createSignal<DroneDeployedLocationType[]>([]);
  const [zoomTo, setZoomTo] = createSignal<ZoomToType>();

  let newSocket: Socket;

  onMount(() => {
    const endpoint = getEndpoint();
    newSocket = io(endpoint);

    newSocket.on("stations", (stations: StationType[]) => {
      console.log("websocket stations", stations);
      setAvailableStations(stations);
    });
    newSocket.on("drones", (drones: DroneType[]) => {
      console.log("websocket drones", drones);
      setAvailableDrones(drones);
    });
    newSocket.on("emergencies", (emergencies: EmergencyType[]) => {
      console.log("websocket emergencies", emergencies);
      setEmergencies(emergencies);
    });
    newSocket.on("deployedDroneUpdate", (drones: DroneDeployedLocationType[]) => {
      setDeployedDrones(drones)
    })
  });

  const deployDrone = (drone: DroneType, emergency: EmergencyType) => {
    console.log("desploy drone", drone);
    if (newSocket) {
      newSocket.emit("deployDrone", {drone, emergency})
    }
  }

  onCleanup(() => {
    setAvailableStations(null);
    setAvailableDrones(null);
    setEmergencies(null);
    if (newSocket) newSocket.disconnect();
  });

  return (
    <>
      <MapDataContext.Provider
        value={{
          availableStations,
          availableDrones,
          emergencies,
          deployedDrones
        }}
      >
        <Map zoomTo={zoomTo()} />
        <Sidebar
          emergencyZoom={(zoomTo: ZoomToType) => {
            setZoomTo(zoomTo);
          }}
          deployDrone={deployDrone}
        />
        <DronesDeployed droneZoom={(zoomTo: ZoomToType) => {
            setZoomTo(zoomTo);
          }}/>
      </MapDataContext.Provider>
    </>
  );
}

export default App;
