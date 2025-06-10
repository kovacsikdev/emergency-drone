import type { EmergencyType, ZoomToType } from "../types";
import { colors } from "../helpers";
import "./EmergencyBox.css";

type EmergencyBoxProps = {
  emergency: EmergencyType;
  emergencyZoom: (props: ZoomToType) => void;
  setEmergency: (emergency: EmergencyType) => void;
};

export const EmergencyBox = (props: EmergencyBoxProps) => {
  return (
    <div class="emergency-call">
      <div>
        <span style={{ color: "#aaa" }}>Case ID:</span>{" "}
        <span style={{ color: `${colors.redLight}` }}>
          {props.emergency?.id}
        </span>
      </div>
      <div>
        <button
          class="custom-button"
          onClick={() => {
            if (props.emergency?.location) {
              props.emergencyZoom({
                location: [
                  props.emergency?.location.lng,
                  props.emergency?.location.lat,
                ],
                zoom: 14.5,
              });
            }
          }}
        >
          Center
        </button>
      </div>
      <div>
        {props.emergency?.location.lat}, {props.emergency?.location.lng}
      </div>
      <div>
        <span style={{ color: "#aaa" }}>Notes:</span>
        <br /> {props.emergency?.notes}
      </div>
      <button
        class="custom-button"
        onClick={() => {
          props.setEmergency(props.emergency);
        }}
      >
        Deploy Drone
      </button>
    </div>
  );
};
