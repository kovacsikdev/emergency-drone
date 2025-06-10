import {
  createSignal,
  createEffect,
  useContext,
} from "solid-js";
import { DeployDrone } from "./DeployDrone";
import { EmergencyBox } from "./EmergencyBox";
import type {
  DroneType,
  EmergencyType,
  ZoomToType,
} from "../types";
import DroneIcon from "../assets/drone-svg.svg";
import { colors, MapDataContext } from "../helpers";
import "./Sidebar.css";

type DroneCountType = {
  ready: number;
  charging: number;
  deployed: number;
};

type SidebarProps = {
  emergencyZoom: (props: ZoomToType) => void;
  deployDrone: (drone: DroneType, emergency: EmergencyType) => void;
};

export const Sidebar = (props: SidebarProps) => {
  const { availableDrones, emergencies } = useContext(MapDataContext);

  const [selectedEmergency, setSelectedEmergency] = createSignal<EmergencyType>();
  const [droneCount, setDroneCount] = createSignal<DroneCountType>({
    ready: 0,
    charging: 0,
    deployed: 0,
  });

  const setEmergency = (emergency: EmergencyType) => {
    setSelectedEmergency(emergency);
  };

  createEffect(() => {
    if (availableDrones()) {
      let count: DroneCountType = {
        ready: 0,
        charging: 0,
        deployed: 0,
      };

      for (let i = 0; i < availableDrones().length; i++) {
        const drone = availableDrones()[i];
        if (drone && drone.status) {
          const assignedDroneStatus = drone.status;
          if (assignedDroneStatus.deployed) count.deployed++;
          if (assignedDroneStatus.charging) count.charging++;
          if (assignedDroneStatus.readyToBeDeployed) count.ready++;
        }
      }

      setDroneCount(count);
    }
  });

  return (
    <>
      <div class="sidebar-component">
        <div class="sidebar-drone-fleet">
          <h2>Drone Fleet</h2>
          <div>
            <img src={DroneIcon} />
          </div>
          <div class="sidebar-drone-status">
            <div style={{ "background-color": `${colors.greenDark}` }}>
              Ready: {droneCount().ready}
            </div>
            <div style={{ "background-color": `${colors.orangeDark}` }}>
              Charging: {droneCount().charging}
            </div>
            <div style={{ "background-color": `${colors.redDark}` }}>
              Deployed: {droneCount().deployed}
            </div>
          </div>
        </div>
        <div class="emergency-calls">
          <h2>Emergency Calls</h2>
          {emergencies() && (
            <div>
              {emergencies().map((item: EmergencyType) => {
                return (
                  <EmergencyBox
                    emergency={item}
                    emergencyZoom={props.emergencyZoom}
                    setEmergency={setEmergency}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedEmergency() && (
        <DeployDrone
          emergency={selectedEmergency() || null}
          drones={availableDrones() ?? []}
          deployDrone={(drone: DroneType) => {
            props.deployDrone(drone, selectedEmergency()!)
          }}
          exitModal={() => {
            setSelectedEmergency(null);
          }}
        />
      )}
    </>
  );
};
