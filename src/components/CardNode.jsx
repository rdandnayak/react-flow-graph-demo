import { Handle, Position } from '@xyflow/react';

// Icon components
const Icons = {
  outlook: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="3" fill="#0078D4"/>
      <text x="8" y="12" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">O</text>
    </svg>
  ),
  powerpoint: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="3" fill="#D24726"/>
      <text x="8" y="12" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">P</text>
    </svg>
  ),
  catalog: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="3" fill="#10B981"/>
      <path d="M4 5h8M4 8h8M4 11h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  question: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#6B7280" strokeWidth="1.5">
      <rect x="1" y="1" width="16" height="16" rx="3"/>
      <text x="9" y="13" textAnchor="middle" fill="#6B7280" fontSize="11" fontWeight="bold" stroke="none">?</text>
    </svg>
  ),
  checkbox: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#6B7280" strokeWidth="1.5">
      <rect x="1" y="1" width="16" height="16" rx="3"/>
      <path d="M5 9l3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  gear: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#10B981" strokeWidth="1.5">
      <circle cx="9" cy="9" r="3"/>
      <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.5 3.5l1.5 1.5M13 13l1.5 1.5M3.5 14.5l1.5-1.5M13 5l1.5-1.5"/>
    </svg>
  ),
  person: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="#6B7280">
      <circle cx="7" cy="4" r="2.5"/>
      <path d="M2 13c0-2.8 2.2-5 5-5s5 2.2 5 5"/>
    </svg>
  ),
  email: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5">
      <rect x="1" y="3" width="14" height="10" rx="2"/>
      <path d="M1 5l7 4 7-4"/>
    </svg>
  ),
  document: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5">
      <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"/>
      <path d="M10 2v3h3M5 8h6M5 11h4"/>
    </svg>
  ),
};

// Tag component
function Tag({ label, variant = 'default' }) {
  const variantClasses = {
    default: 'tag-default',
    primary: 'tag-primary',
    secondary: 'tag-secondary',
  };
  return <span className={`tag ${variantClasses[variant]}`}>{label}</span>;
}

// Source badge component
function SourceBadge({ type, label }) {
  const icon = Icons[type] || Icons.catalog;
  return (
    <div className="source-badge">
      {icon}
      <span>{label}</span>
    </div>
  );
}

// Input card (left side cards)
export function InputCardNode({ data }) {
  const { title, titleIcon, source, description, tags } = data;
  const TitleIconComponent = titleIcon ? Icons[titleIcon] : null;

  return (
    <div className="card-node input-card">
      <Handle type="target" position={Position.Left} />

      {source && <SourceBadge type={source.type} label={source.label} />}

      <h3 className="card-title">
        {TitleIconComponent && <span className="title-icon">{TitleIconComponent}</span>}
        {title}
      </h3>

      {description && <p className="card-description">{description}</p>}

      {tags && tags.length > 0 && (
        <div className="tags-container">
          {tags.map((tag, index) => (
            <Tag key={index} label={tag.label} variant={tag.variant} />
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

// Opportunity card (center)
export function OpportunityNode({ data }) {
  const { title, description, highlights } = data;

  // Function to render description with bold highlights
  const renderDescription = () => {
    if (!highlights || highlights.length === 0) {
      return description;
    }

    let result = description;
    const parts = [];
    let lastIndex = 0;

    highlights.forEach((term) => {
      const index = result.indexOf(term, lastIndex);
      if (index !== -1) {
        if (index > lastIndex) {
          parts.push({ text: result.slice(lastIndex, index), bold: false });
        }
        parts.push({ text: term, bold: true });
        lastIndex = index + term.length;
      }
    });

    if (lastIndex < result.length) {
      parts.push({ text: result.slice(lastIndex), bold: false });
    }

    return parts.map((part, i) =>
      part.bold ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>
    );
  };

  return (
    <div className="card-node opportunity-card">
      <Handle type="target" position={Position.Left} />

      <h3 className="card-title opportunity-title">
        <span className="title-icon">{Icons.gear}</span>
        {title}
      </h3>

      {description && (
        <p className="card-description">{renderDescription()}</p>
      )}

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

// Stakeholders card (right side)
export function StakeholdersNode({ data }) {
  const { title, highlight, people } = data;

  return (
    <div className="card-node stakeholders-card">
      <Handle type="target" position={Position.Left} />

      <h3 className="card-title">
        <span className="title-icon">{Icons.gear}</span>
        {title}
      </h3>

      {highlight && (
        <div className="highlight-box">
          <p dangerouslySetInnerHTML={{ __html: highlight }} />
        </div>
      )}

      {people && people.length > 0 && (
        <div className="people-list">
          {people.map((person, index) => (
            <div key={index} className="person-item">
              <span className="person-icon">{Icons.person}</span>
              <div className="person-info">
                <span className="person-name">{person.name}</span>
                <span className="person-role">{person.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

// Pitch guidance card (right side)
export function PitchGuidanceNode({ data }) {
  const { title, items, buttons } = data;

  return (
    <div className="card-node pitch-card">
      <Handle type="target" position={Position.Left} />

      <h3 className="card-title">
        <span className="title-icon">{Icons.gear}</span>
        {title}
      </h3>

      {items && items.length > 0 && (
        <ul className="card-items">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}

      {buttons && buttons.length > 0 && (
        <div className="buttons-container">
          {buttons.map((button, index) => (
            <button key={index} className="action-button">
              {button.icon === 'email' && Icons.email}
              {button.icon === 'document' && Icons.document}
              <span>{button.label}</span>
            </button>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Right} />
    </div>
  );
}
