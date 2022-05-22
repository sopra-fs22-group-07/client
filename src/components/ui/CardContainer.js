import 'styles/ui/CardContainer.scss';
import PropTypes from "prop-types";

const CardContainer = props => (
    <div {...props} className={`card-container ${props.className ?? ''}`}>
        {props.children}
    </div>
);

CardContainer.propTypes = {
    children: PropTypes.node,
};

export default CardContainer;