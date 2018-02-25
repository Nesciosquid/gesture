import * as React from 'react';
import { getLastHammerAction } from '../../selectors/tools';
import { ReduxState } from '../../reducers/index';
import { connect } from 'react-redux';
import * as _ from 'lodash';

interface HammerActionViewerProps {
  action?: {
    actionType: string;
    event?: HammerInput;
  };
}

function HammerActionViewer(props: HammerActionViewerProps) {
  const action = props.action;
  const event = _.get(props.action, 'event');
  if (action) {
    let hammerData = null;
    if (event) {
      hammerData = (
        <ul>
          <div>Type: {event.type}</div>
          <div>Delta X/Y: {event.deltaX}/{event.deltaY}</div>
          <div>Rotation: {event.rotation}</div>
          <div>Scale: {event.scale}</div>
          <div>Center: {JSON.stringify(event.center)}</div>
        </ul>
      );
    }
    return (
      <div>
        <div>type: {action.actionType}</div>
        <div>
          {hammerData}
        </div>
      </div>
    );
  }
  return null;
}

function mapStateToProps(state: ReduxState) {
  return ({
    action: getLastHammerAction(state)    
  });
}

export default connect(mapStateToProps, null)(HammerActionViewer);