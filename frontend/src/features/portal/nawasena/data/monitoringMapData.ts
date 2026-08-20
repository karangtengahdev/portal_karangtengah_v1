export type Coordinate = [number, number];

export type FieldStatus = 'safe' | 'warning' | 'risk';


export type FieldPlot = {
  id: string;
  name: string;
  status: FieldStatus;
  statusLabel: string;
  area: string;
  detections: number;
  coordinates: Coordinate[];
};

export type DeviceStatus = 'online' | 'warning' | 'moving';

export type ConnectionStatus = 'online' | 'check';

export type FieldDevice = {
  id: string;
  name: string;
  type: 'trap' | 'rover';
  location: string;
  position: Coordinate;
  status: DeviceStatus;
  statusLabel: string;
  detections?: number;
  battery: number;
  connection: ConnectionStatus;
  signal: string;
  updatedAt: string;
};

export type RobotData = {
  id: string;
  name: string;
  position: Coordinate;
  latitude: number;
  longitude: number;
  heading: number;
  battery: number;
  connection: ConnectionStatus;
  signal: string;
  updatedAt: string;
};

export type HeatPoint = {
  id: string;
  position: Coordinate;
  color: string;
  radius: number;
  opacity: number;
};

export const mapConfig = {
  center: [-7.939419, 110.379267] as Coordinate,
  zoom: 19,
  label: 'Karangtengah, Imogiri, Bantul',
};

export const robot: RobotData = {
  id: 'rover-01',
  name: 'Rover 01',
  position: [-7.939419, 110.379267],
  latitude: -7.939419,
  longitude: 110.379267,
  heading: 45,
  battery: 91,
  connection: 'online',
  signal: 'Kuat',
  updatedAt: 'Live',
};

export const fieldPlots: FieldPlot[] = [
  {
    id: 'petak-a',
    name: 'Petak A',
    status: 'safe',
    statusLabel: 'Area Aman',
    area: '0.42 ha',
    detections: 12,
    coordinates: [
      [-7.9402, 110.39255],
      [-7.94016, 110.39345],
      [-7.94086, 110.39358],
      [-7.94102, 110.39258],
    ],
  },
  {
    id: 'petak-b',
    name: 'Petak B',
    status: 'safe',
    statusLabel: 'Area Aman',
    area: '0.38 ha',
    detections: 8,
    coordinates: [
      [-7.94012, 110.3935],
      [-7.9401, 110.39445],
      [-7.94078, 110.39458],
      [-7.94086, 110.39358],
    ],
  },
  {
    id: 'petak-c',
    name: 'Petak C',
    status: 'warning',
    statusLabel: 'Waspada',
    area: '0.35 ha',
    detections: 5,
    coordinates: [
      [-7.94018, 110.3945],
      [-7.9403, 110.39545],
      [-7.94102, 110.39535],
      [-7.9408, 110.39458],
    ],
  },
  {
    id: 'petak-d',
    name: 'Petak D',
    status: 'safe',
    statusLabel: 'Area Aman',
    area: '0.47 ha',
    detections: 3,
    coordinates: [
      [-7.94106, 110.39255],
      [-7.9409, 110.3936],
      [-7.94172, 110.3937],
      [-7.94185, 110.3927],
    ],
  },
];

export const devices: FieldDevice[] = [
  {
    id: 'trap-a1',
    name: 'Trap A1',
    type: 'trap',
    location: 'Petak A',
    position: [-7.94055, 110.39305],
    status: 'online',
    statusLabel: 'Aktif',
    detections: 12,
    battery: 87,
    connection: 'online',
    signal: 'Kuat',
    updatedAt: 'Baru saja',
  },
  {
    id: 'trap-b2',
    name: 'Trap B2',
    type: 'trap',
    location: 'Petak B',
    position: [-7.94049, 110.39403],
    status: 'online',
    statusLabel: 'Aktif',
    detections: 8,
    battery: 62,
    connection: 'online',
    signal: 'Kuat',
    updatedAt: '2 menit lalu',
  },
  {
    id: 'trap-c3',
    name: 'Trap C3',
    type: 'trap',
    location: 'Petak C',
    position: [-7.94063, 110.39502],
    status: 'warning',
    statusLabel: 'Waspada',
    detections: 5,
    battery: 23,
    connection: 'check',
    signal: 'Sedang',
    updatedAt: '6 menit lalu',
  },
  {
    id: 'trap-d4',
    name: 'Trap D4',
    type: 'trap',
    location: 'Petak D',
    position: [-7.94145, 110.39315],
    status: 'online',
    statusLabel: 'Aktif',
    detections: 3,
    battery: 74,
    connection: 'online',
    signal: 'Kuat',
    updatedAt: '9 menit lalu',
  },
  {
    id: 'rover-01',
    name: 'Rover 01',
    type: 'rover',
    location: 'Jalur Tengah',
    position: [-7.94103, 110.39412],
    status: 'moving',
    statusLabel: 'Bergerak',
    battery: 91,
    connection: 'online',
    signal: 'Kuat',
    updatedAt: 'Live',
  },
];

export const roverPath: Coordinate[] = [
  [-7.94054, 110.39282],
  [-7.94072, 110.39325],
  [-7.9409, 110.39372],
  [-7.94103, 110.39412],
  [-7.94091, 110.39465],
  [-7.94068, 110.39506],
];

export const heatPoints: HeatPoint[] = [
  {
    id: 'warning-radius',
    position: [-7.94063, 110.39502],
    color: '#F4B526',
    radius: 72,
    opacity: 0.25,
  },
  {
    id: 'risk-radius',
    position: [-7.94063, 110.39502],
    color: '#EF4141',
    radius: 34,
    opacity: 0.44,
  },
];

export const hourlyDetections = [2, 4, 3, 5, 4, 6, 4, 5, 7, 10, 12, 16, 22, 27, 24, 19, 16, 13, 9, 7, 5, 4, 3, 2];
