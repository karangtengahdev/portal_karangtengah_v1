import { useEffect, useRef } from 'react';
import { IconMinus, IconPlus, IconTarget } from '@tabler/icons-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { mapConfig } from '../data/monitoringMapData';
import { useRoverTrack } from '../hooks/useRoverTrack';

const MAX_ZOOM = 19;
const ROVER_DEVICE_ID = 'ROVER-01';

const createRobotIcon = (heading: number) =>
  L.divIcon({
    className: 'nawasena-device-icon',
    html: `
      <div class="nawasena-device-marker nawasena-device-marker-rover" style="transform: rotate(${heading}deg);">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 3l6 16-6-3-6 3 6-16Z" />
        </svg>
      </div>
    `,
    iconAnchor: [18, 18],
    iconSize: [36, 36],
    popupAnchor: [0, -18],
  });

const createRobotTooltip = (lat: number, lng: number, heading: number, sats: number, gpsFix: boolean) => `
  <div class="nawasena-map-tooltip">
    <strong>Rover 01</strong>
    <div>Lat ${lat.toFixed(6)}, Lon ${lng.toFixed(6)}</div>
    <div>Heading ${heading}&deg;</div>
    <div>${gpsFix ? `GPS Fix &middot; ${sats} satelit` : 'GPS tidak terkunci'}</div>
  </div>
`;

export const MonitoringMap = ({ fullBleed = false }: { fullBleed?: boolean }) => {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const robotMarkerRef = useRef<L.Marker | null>(null);

  const { latestPoint, isLoading, isError } = useRoverTrack(ROVER_DEVICE_ID);

  // Init peta sekali saja
  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) {
      return;
    }

    const map = L.map(mapElementRef.current, {
      attributionControl: true,
      center: mapConfig.center,
      maxZoom: MAX_ZOOM,
      minZoom: 14,
      preferCanvas: true,
      scrollWheelZoom: false,
      zoom: MAX_ZOOM,
      zoomControl: false,
    });

    map.attributionControl.setPrefix('');
    mapRef.current = map;

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics',
        className: 'nawasena-satellite-tile',
        maxZoom: MAX_ZOOM,
      },
    ).addTo(map);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
      {
        className: 'nawasena-label-tile',
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: MAX_ZOOM,
        opacity: 0.72,
        subdomains: 'abcd',
      },
    ).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      robotMarkerRef.current = null;
    };
  }, []);

  // Update / buat marker tiap kali data baru dari API datang
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !latestPoint) {
      return;
    }

    const position: L.LatLngExpression = [latestPoint.lat, latestPoint.lng];
    const tooltipHtml = createRobotTooltip(
      latestPoint.lat,
      latestPoint.lng,
      latestPoint.heading,
      latestPoint.sats,
      latestPoint.gpsFix,
    );

    if (!robotMarkerRef.current) {
      robotMarkerRef.current = L.marker(position, {
        icon: createRobotIcon(latestPoint.heading),
        title: 'Rover 01',
      })
        .bindTooltip(tooltipHtml, {
          className: 'nawasena-device-tooltip',
          direction: 'top',
          offset: [0, -16],
          opacity: 1,
          permanent: false,
        })
        .addTo(map);
      return;
    }

    robotMarkerRef.current.setLatLng(position);
    robotMarkerRef.current.setIcon(createRobotIcon(latestPoint.heading));
    robotMarkerRef.current.setTooltipContent(tooltipHtml);
  }, [latestPoint]);

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleFocusRobot = () => {
    if (!latestPoint) return;
    mapRef.current?.flyTo([latestPoint.lat, latestPoint.lng], MAX_ZOOM, {
      animate: true,
      duration: 0.6,
    });
  };

  return (
    <div
      className={[
        'relative overflow-hidden bg-emerald-950 shadow-[0_24px_80px_rgba(15,23,42,0.14)]',
        fullBleed ? '' : 'rounded-[30px] border border-white/80',
      ].join(' ')}
    >
      <div
        aria-label="Peta posisi robot Karangtengah"
        className={[
          'nawasena-monitoring-map w-full',
          fullBleed
            ? 'h-[580px] sm:h-[620px] lg:h-[680px]'
            : 'h-[480px] md:h-[500px] xl:h-[500px]',
        ].join(' ')}
        ref={mapElementRef}
      />

      <div className="pointer-events-none absolute inset-0 z-[500] bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.18))]" />

      <div className="absolute left-4 top-1/2 z-[700] grid -translate-y-1/2 overflow-hidden rounded-full border border-white/20 bg-[#091612]/82 p-1 text-white shadow-[0_16px_42px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:left-8">
        <button
          aria-label="Perbesar peta"
          className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-white/12"
          onClick={handleZoomIn}
          title="Perbesar"
          type="button"
        >
          <IconPlus size={20} stroke={1.8} />
        </button>
        <button
          aria-label="Perkecil peta"
          className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-white/12"
          onClick={handleZoomOut}
          title="Perkecil"
          type="button"
        >
          <IconMinus size={20} stroke={1.8} />
        </button>
        <button
          aria-label="Fokus ke posisi robot"
          className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-white/12"
          onClick={handleFocusRobot}
          title="Fokus ke robot"
          type="button"
        >
          <IconTarget size={20} stroke={1.8} />
        </button>
      </div>

      <div className="absolute bottom-4 left-3 z-[700] flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-2 rounded-full border border-white/18 bg-[#091612]/78 px-3 py-2 text-[10px] font-semibold text-white shadow-xl shadow-slate-950/25 backdrop-blur-xl sm:bottom-5 sm:left-8 sm:gap-4 sm:px-4 sm:py-3 sm:text-xs">
  {isLoading && <span>Memuat posisi robot...</span>}
  {isError && <span className="text-red-300">Gagal memuat data robot</span>}
  {latestPoint && (
    <>
      <span className="inline-flex items-center gap-1.5 sm:gap-2">
        <span
          className={[
            'h-2 w-2 rounded sm:h-3 sm:w-3',
            latestPoint.gpsFix ? 'bg-sky-400' : 'bg-red-500',
          ].join(' ')}
        />
        {latestPoint.status}
      </span>
      {/* Di mobile sembunyikan label "Lat/Lon", tampilkan angka saja lebih ringkas */}
      <span className="hidden sm:inline">
        Lat {latestPoint.lat.toFixed(6)}, Lon {latestPoint.lng.toFixed(6)}
      </span>
      <span className="sm:hidden">
        {latestPoint.lat.toFixed(4)}, {latestPoint.lng.toFixed(4)}
      </span>
      <span>
        <span className="hidden sm:inline">Heading </span>
        {latestPoint.heading}&deg;
      </span>
      <span>{latestPoint.sats} <span className="hidden sm:inline">satelit</span><span className="sm:hidden">sat</span></span>
    </>
  )}
</div>
    </div>
  );
};