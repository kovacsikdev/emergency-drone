export type ZoomToType = {
  location: [number, number],
  zoom: number
}

export type LocationType = {
  lat: number,
  lng: number
}

export type StationType = {
  id: string,
  type: string,
  location: LocationType
}

export type DroneHeadingToType = {
  location?: LocationType,
  name: string
}

export type DroneStatusType = {
  health: "good" | "warning" | "bad",
  readyToBeDeployed: boolean,
  charging: boolean,
  batteryLife: string,
  deployed: boolean,
  currentLocation: LocationType,
  headingTo?: DroneHeadingToType,
  eta?: string,
  currentSpeed?: number
}

export type AssignedDronesType = {
  id: string,
  status: DroneStatusType
}

export type EmergencyType = {
  id: string,
  type: string,
  location: LocationType,
  notes: string
} | null;

export type DroneType = {
  id: string,
  stationAssigned: string,
  status: DroneStatusType
} | null;

export type DataType = {
  availableStations: StationType[]
  availableDrones: DroneType[]
  emergencies: EmergencyType[]
} | null;

export type DroneDeployedLocationType = {
  id: string,
  location: [number, number],
  headingTo: LocationType,
  deployed?: boolean
}