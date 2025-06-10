import { useContext } from "solid-js";
import type { DroneType, ZoomToType } from "../types";
import { MapDataContext } from "../helpers";

import "./DronesDeployed.css";

type DronesDeployedProps = {
  droneZoom: (props: ZoomToType) => void;
};

export const DronesDeployed = (props: DronesDeployedProps) => {
  const { deployedDrones } = useContext(MapDataContext);

  const zoomToDrone = (drone: DroneType) => {
    if (drone) {
      props.droneZoom({
        location: [
          drone.status.currentLocation.lng,
          drone.status.currentLocation.lat,
        ],
        zoom: 16,
      });
    }
  };

  return (
    <div class="drones-deployed">
      <h2>Drones deployed: {deployedDrones().length}</h2>
      <div>
        {deployedDrones().length > 0 &&
          deployedDrones().map((drone: DroneType) => {
            return (
              <div>
                {drone && (
                  <div class="drones-deployed-drone">
                    <div>
                      <span style={{ color: "#aaa" }}>ID:</span> {drone.id}
                    </div>
                    <div>
                      <span style={{ color: "#aaa" }}>LAT:</span>:{" "}
                      {drone.status.currentLocation.lng.toFixed(5)}
                    </div>
                    <div>
                      <span style={{ color: "#aaa" }}>LNG:</span>:{" "}
                      {drone.status.currentLocation.lat.toFixed(5)}
                    </div>
                    <div>
                      <span style={{ color: "#aaa" }}>Heading to:</span>{" "}
                      {drone.status.headingTo?.name}
                    </div>
                    <div>
                      <span style={{ color: "#aaa" }}>ETA:</span>{" "}
                      {drone.status.eta}
                    </div>
                    <button
                      onClick={() => {
                        zoomToDrone(drone);
                      }}
                    >
                      center
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
