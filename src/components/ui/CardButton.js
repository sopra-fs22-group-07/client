import "styles/ui/CardButton.scss"

const CardButton = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`card-button ${props.className}`}>
        <div className={"card-text"}>
            {props.children}
        </div>
    </button>
)

export default CardButton