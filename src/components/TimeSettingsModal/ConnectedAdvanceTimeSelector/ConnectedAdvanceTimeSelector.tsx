import { connect } from 'react-redux';
import { ReduxState } from '../../../reducers/index';
import { getAdvanceTime, getAutoAdvance } from '../../../selectors/settings';
import { setAdvanceTime } from '../../../actions/settings';
import AdvanceTimeSelector from './AdvanceTimeSelector/AdvanceTImeSelector';

function mapStateToProps(state: ReduxState) {
    return ({
        advanceTime: getAdvanceTime(state),
        active: getAutoAdvance(state)
    });
}

function mapDispatchToProps(dispatch: Function) {
    return ({
        onClickOption: (time: number) => dispatch(setAdvanceTime(time)),
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvanceTimeSelector);