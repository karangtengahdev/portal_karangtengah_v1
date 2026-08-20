import {
  IconChevronDown,
  IconCloud,
  IconDroplet,
  IconMapPin,
  IconWind,
} from '@tabler/icons-react';

export const WeatherPanel = ({
  compact = false,
  // onRefresh = () => undefined,
}: {
  compact?: boolean;
  onRefresh?: () => void;
}) => (
  <article className={[
    "rounded-[22px] border border-white/30 bg-white/16 shadow-[0_16px_42px_rgba(0,0,0,0.18)] ring-1 ring-white/10 backdrop-blur-2xl",
    compact ? "p-3" : "rounded-[22px] bg-white/16 p-4",
  ].join(" ")}>
    
    <div className="flex items-start gap-2.5">
      {!compact && (
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/22 bg-white/18 text-white shadow-inner shadow-white/15">
          <IconCloud aria-hidden="true" size={24} stroke={1.7} />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {compact && <IconCloud aria-hidden="true" size={14} stroke={1.7} className="shrink-0 text-white/80" />}
          <h2 className={["font-bold leading-tight tracking-normal text-white", compact ? "text-xs" : "text-base"].join(" ")}>
            Karangtengah
          </h2>
          {!compact && <IconChevronDown aria-hidden="true" className="text-white/62" size={15} />}
        </div>
        {!compact && (
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-white/76">
            <IconMapPin aria-hidden="true" size={13} />
            Imogiri, Bantul
          </p>
        )}
      </div>
    </div>

    <div className={["grid items-center", compact ? "mt-2 gap-2" : "mt-5 gap-4 sm:grid-cols-[1fr_126px]"].join(" ")}>
      <div>
        <p className={["font-extrabold leading-none tracking-normal text-white/76", compact ? "text-2xl" : "text-4xl"].join(" ")}>
          28<span className={["align-top", compact ? "text-sm" : "text-xl"].join(" ")}>&deg;C</span><span className={["font-semibold text-white/76", compact ? "ml-3 mt-1 text-[11px]" : "mt-1.5 text-sm"].join(" ")}>Berawan</span> 
        </p>
      </div>

      {/* Stats — di compact tampil horizontal ringkas */}
      <div className={[
        "grid text-xs",
        compact
          ? "grid-cols-2 gap-x-3 gap-y-1.5 mt-1"
          : "gap-3 border-white/18 sm:border-l sm:pl-5",
      ].join(" ")}>
        <div className="flex items-center gap-1.5">
          <IconDroplet aria-hidden="true" className="text-white/82 shrink-0" size={compact ? 13 : 17} stroke={1.8} />
          <div>
            <p className="font-bold leading-tight text-white/66">78%</p>
            {!compact && <p className="mt-1 text-white/66">Kelembapan</p>}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <IconWind aria-hidden="true" className="text-white/82 shrink-0" size={compact ? 13 : 17} stroke={1.8} />
          <div>
            <p className="font-bold leading-tight text-white/66">{compact ? "10 km/j" : "10 km/jam"}</p>
            {!compact && <p className="mt-1 text-white/66">Angin</p>}
          </div>
        </div>
      </div>
    </div>
  </article>
);