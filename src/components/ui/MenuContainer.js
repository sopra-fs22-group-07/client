import 'styles/ui/MenuContainer.scss';
import PropTypes from "prop-types";

const BaseContainer = props => (
    <div {...props} className={`menu-container ${props.className ?? ''}`}>
        {props.children}
    </div>
);

BaseContainer.propTypes = {
    children: PropTypes.node,
};

export default BaseContainer;