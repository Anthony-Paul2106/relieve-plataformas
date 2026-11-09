type SpecIconName = "height" | "reach" | "capacity" | "traction";

const specifications: {
  icon: SpecIconName;
  label: string;
  value: string;
  note: string;
}[] = [
  { icon: "height", label: "Altura de trabajo", value: "≈ 20.3 m", note: "≈ 66 ft" },
  { icon: "reach", label: "Alcance horizontal", value: "12.1 m", note: "39 ft 9 in" },
  { icon: "capacity", label: "Capacidad de carga", value: "227 kg", note: "500 lb" },
  { icon: "traction", label: "Tracción", value: "4×4", note: "Versión 4WD" },
];

function SpecIcon({ name }: { name: SpecIconName }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "height" && (
        <>
          <path d="M24 7v34M18 13l6-6 6 6M18 35l6 6 6-6" />
          <path d="M12 16v16M36 16v16" />
        </>
      )}
      {name === "reach" && (
        <>
          <path d="M7 24h34M13 18l-6 6 6 6M35 18l6 6-6 6" />
          <path d="M17 13v22M31 13v22" />
        </>
      )}
      {name === "capacity" && (
        <>
          <path d="M15 18h18l5 22H10l5-22Z" />
          <path d="M19 18v-4a5 5 0 0 1 10 0v4" />
          <path d="M17 28h14" />
          <text x="24" y="36" textAnchor="middle" fill="currentColor" stroke="none" fontSize="9" fontWeight="800">KG</text>
        </>
      )}
      {name === "traction" && (
        <>
          <circle cx="24" cy="24" r="11" />
          <circle cx="24" cy="24" r="5" />
          <path d="M21 5h6l1 5 4 2 4-2 4 5-3 4 1 5 4 2-2 6-5-.2-4 3-.5 5h-6l-1-5-4-2-4 2-4-5 3-4-1-5-4-2 2-6 5 .2 4-3L21 5Z" />
        </>
      )}
    </svg>
  );
}

export function ServiceAssurances() {
  return (
    <section className="equipment-specs" id="equipo" aria-labelledby="specs-title">
      <h2 className="visually-hidden" id="specs-title">Especificaciones referenciales del JLG 600AJ</h2>
      <ul className="spec-list">
        {specifications.map(({ icon, label, value, note }) => (
          <li className="spec-card" key={label}>
            <span className={`spec-icon spec-icon--${icon}`}><SpecIcon name={icon} /></span>
            <span className="spec-copy">
              <span className="spec-label">{label}</span>
              <strong>{value}</strong>
              <small>{note}</small>
            </span>
          </li>
        ))}
      </ul>
      <p className="spec-disclaimer">
        Ficha referencial JLG 600AJ. Altura de plataforma: 18.47 m; alcance: 12.1 m.
        La capacidad puede figurar como 227 o 230 kg según norma y versión. Confirmar
        serie, configuración y disponibilidad del equipo antes de cotizar.
      </p>
    </section>
  );
}
