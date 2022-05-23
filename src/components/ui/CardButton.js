import "styles/ui/CardButton.scss"
import Grid from '@mui/material/Grid';

const CardButton = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`card-button ${props.className}`}>
        <div className="scrollable-div" style={{width: props.width}}>
            {props.children}
            {props.icon ? <br/> : null}
            {props.icon ? <Grid sx={{fontSize: 45}}>{props.icon}</Grid> : null}
        </div>
    </button>
)

export default CardButton