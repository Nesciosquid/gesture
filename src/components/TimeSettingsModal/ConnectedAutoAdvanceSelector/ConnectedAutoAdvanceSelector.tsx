import { connect } from 'react-redux';
import { getAutoAdvance } from '../../../selectors/settings';
import { setAutoAdvance } from '../../../actions/settings'; 
import { ReduxState } from '../../../reducers/';
import AutoAdvanceSelector from './AutoAdvanceSelector/AutoAdvanceSelector';

function mapStateToProps(state: ReduxState) {
    return ({
        active: getAutoAdvance(state)
    });
}

function mapDispatchToProps(dispatch: Function) {
    return ({
        onClick: (advance: boolean) => dispatch(setAutoAdvance(advance))
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoAdvanceSelector);