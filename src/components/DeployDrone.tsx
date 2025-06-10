import { createSignal, createEffect } from "solid-js";
import * as turf from "@turf/turf";
import type { DroneType, EmergencyType } from "../types";
import { debounce } from "../helpers";
import DroneIcon from "../assets/drone-svg.svg";
import "./DeployDrone.css";

type DeployDroneProps = {
  emergency: EmergencyType;
  drones: DroneType[];
  deployDrone: (drone: DroneType) => void;
  exitModal: () => void;
};

export const DeployDrone = (props: DeployDroneProps) => {
  const [filteredDrones, setFilteredDrones] = createSignal<DroneType[]>([]);
  const [selectedDrone, setSelectedDrone] = createSignal<DroneType>(null);
  const [enableDeployButton, setEnableDeployButton] = createSignal(false);

  const filterItems = (query: string) => {
    if (!query.trim()) {
      return props.drones; // Return all items if search query is empty
    }

    const lowercaseQuery = query.toLowerCase();

    return props.drones.filter((data) =>
      data?.id.toLowerCase().includes(lowercaseQuery)
    );
  };

  const handleSearch = (e: any) => {
    const value = e.target.value;
    console.log("value", value);

    const filtered = filterItems(value);
    setFilteredDrones(filtered);
  };
  const debouncedSearch = debounce({
    func: handleSearch,
    delay: 300,
  });

  const droneDistance = (drone: DroneType) => {
    if (drone?.status.currentLocation && props.emergency?.location) {
      const from = turf.point([
        drone?.status.currentLocation.lng,
        drone?.status.currentLocation.lat,
      ]);
      const to = turf.point([
        props.emergency.location.lng,
        props.emergency.location.lat,
      ]);
      const distance = turf.distance(from, to, { units: "miles" });
      return distance.toFixed(2);
    }
    return 0;
  };

  const selectDrone = (drone: DroneType) => {
    setEnableDeployButton(true);
    setSelectedDrone(drone);
  };

  createEffect(() => {
    if (props.drones) {
      const sorted = props.drones;
      sorted.sort((a: DroneType, b: DroneType) => {
        const aReady = a?.status?.readyToBeDeployed ? 1 : 0;
        const bReady = b?.status?.readyToBeDeployed ? 1 : 0;
        return bReady - aReady;
      });
      setFilteredDrones(props.drones);
    }
  });

  return (
    <>
      <div
        class="modal-overlay"
        onclick={() => {
          props.exitModal();
        }}
      ></div>
      <div class="modal-popup">
        <button class="modal-exit" onclick={props.exitModal}>
          X
        </button>
        <div class="drone-description">
          <div class="drone-description-title">
            Deploy# {props.emergency?.id}
          </div>
          <div>Please select drone for the mission</div>
          <input
            type="text"
            placeholder="Search for drones"
            oninput={debouncedSearch}
          />
        </div>
        <div class="deploy">
          {filteredDrones().map((item, index) => {
            return (
              <label
                class={`deploy-wrapper ${
                  !item?.status.readyToBeDeployed && "deploy-selection-disabled"
                }`}
                for={`select-${index}`}
              >
                <div class="deploy-selection">
                  <div>
                    <input
                      id={`select-${index}`}
                      type="radio"
                      name="deploy-drone"
                      onChange={() => {
                        selectDrone(item);
                      }}
                      disabled={!item?.status.readyToBeDeployed}
                    />
                  </div>
                  <div>
                    {item?.id}
                    <div>{droneDistance(item)} miles away</div>
                  </div>
                </div>
                <div class="deploy-status">
                  <img src={DroneIcon} />
                  {item?.status.readyToBeDeployed ? (
                    <div class="deploy-status-marker deploy-ready">
                      Ready to fly
                    </div>
                  ) : item?.status.deployed ? (
                    <div class="deploy-status-marker deploy-ready">
                      Deployed
                    </div>
                  ) : item?.status.charging ? (
                    <div class="deploy-status-marker deploy-charging">
                      Charging
                    </div>
                  ) : (
                    <div class="deploy-status-marker deploy-health">
                      {item?.status.health}
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
        <button
          class="custom-button"
          disabled={!enableDeployButton()}
          onclick={() => {
            props.deployDrone(selectedDrone());
            props.exitModal();
          }}
        >
          Deploy
        </button>
      </div>
    </>
  );
};
