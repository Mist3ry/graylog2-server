import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from 'react-bootstrap';

import connect from 'stores/connect';
import UserNotification from 'util/UserNotification';
import { widgetDefinition } from 'enterprise/logic/Widget';
import { WidgetActions } from 'enterprise/stores/WidgetStore';
import { TitlesActions } from 'enterprise/stores/TitlesStore';
import { DashboardWidgetsActions } from 'enterprise/stores/DashboardWidgetsStore';

import WidgetFrame from './WidgetFrame';
import WidgetHeader from './WidgetHeader';
import WidgetFilterMenu from './WidgetFilterMenu';
import WidgetActionDropdown from './WidgetActionDropdown';
import WidgetHorizontalStretch from './WidgetHorizontalStretch';
import MeasureDimensions from './MeasureDimensions';

import styles from './Widget.css';
import EditWidgetFrame from './EditWidgetFrame';
import { ViewMetadataStore } from '../../stores/ViewMetadataStore';
import LoadingWidget from './LoadingWidget';

class Widget extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    widget: PropTypes.shape({
      computationTimeRange: PropTypes.object,
      config: PropTypes.object.isRequired,
    }).isRequired,
    data: PropTypes.any.isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
    fields: PropTypes.any.isRequired,
    onSizeChange: PropTypes.func.isRequired,
    onPositionsChange: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    position: PropTypes.object.isRequired,
  };

  static defaultProps = {
    height: 1,
    width: 1,
  };

  static _visualizationForType(type) {
    return widgetDefinition(type).visualizationComponent;
  }

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
  }

  _onDelete = (widget) => {
    if (window.confirm(`Are you sure you want to remove the widget "${this.props.title}"?`)) {
      WidgetActions.remove(widget.id);
    }
  };

  _onDuplicate = (widgetId) => {
    WidgetActions.duplicate(widgetId);
  };

  _onToggleEdit = () => {
    this.setState(state => ({ editing: !state.editing }));
  };

  _onAddToOverview = (queryId, widgetId) => {
    DashboardWidgetsActions.addToDashboard(queryId, widgetId)
      .then(
        () => UserNotification.success('Added widget to dashboard.', 'Success!'),
        e => UserNotification.error(`Failed adding widget to dashboard: ${e}`, 'Error!'),
      );
  };

  _onWidgetConfigChange = (widgetId, config) => {
    WidgetActions.updateConfig(widgetId, config);
  };

  render() {
    const { id, widget, data, height, width, fields, onSizeChange, title } = this.props;
    const { config, computationTimeRange, filter } = widget;
    const VisComponent = data ? Widget._visualizationForType(widget.type) : LoadingWidget;
    const { editing } = this.state;
    const { activeQuery } = this.props.view;
    const visualization = (
      <VisComponent id={id}
                    editing={editing}
                    title={widget.title}
                    config={config}
                    data={data}
                    fields={fields}
                    height={height}
                    width={width}
                    filter={filter}
                    onChange={newWidgetConfig => this._onWidgetConfigChange(id, newWidgetConfig)}
                    onFinishEditing={this._onToggleEdit}
                    computationTimeRange={computationTimeRange} />
    );
    const widgetActionDropdownCaret = <i className={`fa fa-chevron-down ${styles.widgetActionDropdownCaret} ${styles.tonedDown}`} />;
    if (editing) {
      let editWidgetFrameContent = null;
      return (
        <EditWidgetFrame widgetId={id}>
          <span ref={(elem) => { editWidgetFrameContent = elem; }}>
            <MeasureDimensions>
              <WidgetHeader title={title}
                            onRename={newTitle => TitlesActions.set('widget', id, newTitle)}
                            editing={editing}>
                <WidgetFilterMenu onChange={newFilter => WidgetActions.filter(id, newFilter)} value={filter}>
                  <i className={`fa fa-filter ${styles.widgetActionDropdownCaret} ${filter ? styles.filterSet : styles.filterNotSet}`} />
                </WidgetFilterMenu>
                {' '}
                <WidgetActionDropdown element={widgetActionDropdownCaret} container={() => editWidgetFrameContent}>
                  <MenuItem onSelect={this._onToggleEdit}>Finish Editing</MenuItem>
                </WidgetActionDropdown>
              </WidgetHeader>
              {visualization}
            </MeasureDimensions>
          </span>
        </EditWidgetFrame>
      );
    }
    let container = null;
    return (
      <WidgetFrame widgetId={id} onSizeChange={onSizeChange}>
        <span ref={(elem) => { container = elem; }}>
          <WidgetHeader title={title}
                        onRename={newTitle => TitlesActions.set('widget', id, newTitle)}
                        editing={editing}>
            <WidgetHorizontalStretch widgetId={widget.id}
                                     widgetType={widget.type}
                                     onStretch={this.props.onPositionsChange}
                                     position={this.props.position} />
            {' '}
            <WidgetFilterMenu onChange={newFilter => WidgetActions.filter(id, newFilter)} value={filter}>
              <i className={`fa fa-filter ${styles.widgetActionDropdownCaret} ${filter ? styles.filterSet : styles.filterNotSet}`} />
            </WidgetFilterMenu>
            {' '}
            <WidgetActionDropdown element={widgetActionDropdownCaret} container={() => container}>
              <MenuItem onSelect={this._onToggleEdit}>Edit</MenuItem>
              <MenuItem onSelect={() => this._onDuplicate(id)}>Duplicate</MenuItem>
              <MenuItem divider />
              <MenuItem onSelect={() => this._onAddToOverview(activeQuery, id)}>Add to overview</MenuItem>
              <MenuItem divider />
              <MenuItem onSelect={() => this._onDelete(widget)}>Delete</MenuItem>
            </WidgetActionDropdown>
          </WidgetHeader>
          {visualization}
        </span>
      </WidgetFrame>
    );
  }
}

export default connect(Widget, { view: ViewMetadataStore });
