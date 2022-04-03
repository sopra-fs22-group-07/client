import "styles/ui/CardButton.scss"

const CardButton = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`card-button ${props.className}`}>
        {props.children}
    </button>
)

export default CardButton