import "styles/ui/Card.scss";

export const Card = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`primary-card ${props.className}`}>
      <div className="card-text">
        {props.children}
      </div>
  </button>
);
