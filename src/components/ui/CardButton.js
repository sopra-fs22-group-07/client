import "styles/ui/CardButton.scss";

export const CardButton = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`primary-cardButton ${props.className}`}>
    {props.children}
  </button>
);
