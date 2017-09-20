import React, { Component } from 'react';
import Dimensions from 'react-dimensions';
import { connect } from 'react-redux';
import { fetchUsers, setData, setColumnWidth, setQuery } from '../modules/results';
import './Results.scss';
import Authenticated  from '../../../containers/Authenticated';
import { Table, Column, Cell } from 'fixed-data-table';
import 'fixed-data-table/dist/fixed-data-table.min.css';
import  _ from 'lodash';
import ReactFilterBox, { SimpleResultProcessing, GridDataAutoCompleteHandler }
from 'react-filter-box';
import 'react-filter-box/lib/react-filter-box.css';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Link, browserHistory } from 'react-router';
import moment from 'moment';
import { CSVLink } from 'react-csv';

class CustomAutoComplete extends GridDataAutoCompleteHandler {

  needOperators(parsedCategory) {
    const result = super.needOperators(parsedCategory);
    return result.concat(['startsWith', 'after', 'before', '>', '<']);
  }

  needValues(parsedCategory, parsedOperator) {
    if (parsedOperator === 'after' || parsedOperator === 'before') {
      return ['date'];
    } else if (parsedOperator === '>' || parsedOperator === '<') {
      return ['number'];
    }

    return super.needValues(parsedCategory, parsedOperator);
  }
}

class CustomResultProcessing extends SimpleResultProcessing {
  filter(row, fieldOrLabel, operator, value) {
    const field = this.tryToGetFieldCategory(fieldOrLabel);
    switch (operator) {
    case '==': return row[field] === value;
    case '!=': return row[field] !== value;
    case 'contains': return row[field].toLowerCase().indexOf(value.toLowerCase()) >= 0;
    case '!contains': return row[field].toLowerCase().indexOf(value.toLowerCase()) < 0;
    case 'startsWith': return _.startsWith(row[field].toLowerCase(), value.toLowerCase());
    case 'after': return (moment(row[field]) > moment(value));
    case 'before': return (moment(row[field]) < moment(value));
    case '>': return parseInt(row[field]) > parseInt(value);
    case '<': return parseInt(row[field]) < parseInt(value);
    }
    return false;
  }
}

function flattenProfiles(users) {
  const profiles = [];
  users.forEach(user => {
    user.profiles.forEach(profile => {
      const pastedUser = { ...user, ...profile };
      delete pastedUser.profiles;
      profiles.push(pastedUser);
    });
  });
  return profiles;
}

class Results extends Component {
  static propTypes = {
    fetchUsers: React.PropTypes.func.isRequired,
    setColumnWidth: React.PropTypes.func.isRequired,
    setData: React.PropTypes.func.isRequired,
    setQuery: React.PropTypes.func.isRequired,
    data: React.PropTypes.array.isRequired,
    query: React.PropTypes.string.isRequired,
    columnWidths: React.PropTypes.object.isRequired,
    users: React.PropTypes.array.isRequired,
    containerWidth: React.PropTypes.number,
    credentials: React.PropTypes.object
  };

  componentWillMount() {
    if (this.props.credentials.role !== 'admin') {
      browserHistory.push(`/profiles/${this.props.credentials.id}`);
    } else {
      this.props.fetchUsers();
    }
  }

  resizeColumn(newColumnWidth, columnKey) {
    this.props.setColumnWidth({ newColumnWidth, columnKey });
  }

  onParseOk(expressions) {
    const filteredData = new CustomResultProcessing(this.options).process(this.props.users, expressions);
    this.props.setData(filteredData);
  }

  customRenderCompletionItem(self, data, registerAndGetPickFunc) {
    const pick = registerAndGetPickFunc();
    const className = `hint-value cm-${data.type}`;
    switch (data.value) {
    case 'date':
      return (<div className="day-picker-selection">
        <DayPicker onDayClick={day => pick(moment(day).format('l')) } />
      </div>);
    default:
      return (<div className={className}>
        <span style={{ fontWeight: 'bold' }}>{data.value}</span>
      </div>);
    }
  }

  options = [
    {
      columField: 'email',
      type: 'text'
    },
    {
      columField: 'firstName',
      type: 'text'
    },
    {
      columField: 'lastName',
      type: 'text'
    },
    {
      columField: 'birthYear',
      type: 'number'
    },
    {
      columField: 'gender',
      type: 'selection'
    },
    {
      columField: 'ethnicity',
      type: 'selection'
    },
    {
      columField: 'nationality',
      type: 'selection'
    },
    {
      columField: 'major',
      type: 'selection'
    },
    {
      columField: 'workingExperience',
      type: 'selection'
    },
    {
      columField: 'noOfResponses',
      type: 'number'
    },
    {
      columField: 'lastResponseDate',
      type: 'date'
    },
    {
      columField: 'tags',
      type: 'selection'
    },
    {
      columField: 'organization',
      type: 'text'
    }
  ];


  render() {
    const { data, columnWidths, query, setQuery, users, containerWidth } = this.props;
    const rows = data;
    const csv = flattenProfiles(data);

    return (
      <div className="custom-container">
        <h1>Results</h1>
        <CSVLink className="btn btn-primary right" filename="survey_responses.csv" data={csv} target="_blank">
          Download CSV
        </CSVLink>
        <div className="box">
          <ReactFilterBox data={users} options={this.options} query={query} onParseOk={this.onParseOk.bind(this)}
                          customRenderCompletionItem={this.customRenderCompletionItem.bind(this)}
                          autoCompleteHandler={new CustomAutoComplete(users, this.options)}
                          onChange={query => setQuery(query)} />
        </div>
        <Table rowHeight={50} rowsCount={rows.length} width={0.95 * containerWidth}
               height={50 * (rows.length + 1.5)} headerHeight={50}
               isColumnResizing={false} onColumnResizeEndCallback={this.resizeColumn.bind(this)}>
          <Column columnKey="id" header={<Cell>Responses</Cell>} cell={({ rowIndex }) => (
            <Cell>
              <Link to={`/profiles/${rows[rowIndex].id}`}>View Responses</Link>
            </Cell>
          ) } width={columnWidths.id || 100} isResizable={true} allowCellsRecycling={true} />
          <Column columnKey="email" header={<Cell>Email</Cell>} cell={({ rowIndex }) => (
            <Cell>
              {rows[rowIndex].email}
            </Cell>
            ) } width={columnWidths.email || 200} isResizable={true} allowCellsRecycling={true} />
          <Column columnKey="lastName" header={<Cell>Last Name</Cell>} cell={({ rowIndex }) => (
            <Cell>
              {rows[rowIndex].lastName}
            </Cell>
            ) } width={columnWidths.lastName || 100} isResizable={true} allowCellsRecycling={true} />
          <Column columnKey="firstName" header={<Cell>First Name</Cell>} cell={({ rowIndex }) => (
            <Cell>
              {rows[rowIndex].firstName}
            </Cell>
            ) } width={columnWidths.firstName || 100} isResizable={true} allowCellsRecycling={true} />
          <Column columnKey="birthYear" header={<Cell>Birth Year</Cell>} cell={({ rowIndex }) => (
            <Cell>
              {rows[rowIndex].birthYear}
            </Cell>
            ) } width={columnWidths.birthYear || 100} isResizable={true} allowCellsRecycling={true} />
          <Column columnKey="gender" header={<Cell>Gender</Cell>} cell={({ rowIndex }) => (
            <Cell>
              {rows[rowIndex].gender}
            </Cell>
            ) } width={columnWidths.gender || 100} isResizable={true} allowCellsRecycling={true} />
          <Column columnKey="ethnicity" header={<Cell>Ethnicity</Cell>} cell={({ rowIndex }) => (
            <Cell>
              {rows[rowIndex].ethnicity}
            </Cell>
            ) } width={columnWidths.ethnicity || 100} isResizable={true} allowCellsRecycling={true} />
          <Column columnKey="nationality" header={<Cell>Nationality</Cell>} cell={({ rowIndex }) => (
            <Cell>
              {rows[rowIndex].nationality}
            </Cell>
            ) } width={columnWidths.nationality || 100} isResizable={true} allowCellsRecycling={true} />
          <Column columnKey="major" header={<Cell>Major</Cell>} cell={({ rowIndex }) => (
            <Cell>
              {rows[rowIndex].major}
            </Cell>
            ) } width={columnWidths.major || 100} isResizable={true} allowCellsRecycling={true} />
          <Column columnKey="workingExperience" header={<Cell>Working Experience</Cell>} cell={({ rowIndex }) => (
            <Cell>
              {rows[rowIndex].workingExperience}
            </Cell>
            ) } width={columnWidths.workingExperience || 100} isResizable={true} allowCellsRecycling={true} />
          <Column columnKey="noOfResponses" header={<Cell>Number of Responses</Cell>} cell={({ rowIndex }) => (
            <Cell>
              {rows[rowIndex].noOfResponses}
            </Cell>
            ) } width={columnWidths.noOfResponses || 120} isResizable={true} allowCellsRecycling={true} />
          <Column columnKey="tags" header={<Cell>Tags</Cell>} cell={({ rowIndex }) => (
            <Cell>
              {rows[rowIndex].tags}
            </Cell>
          ) } width={columnWidths.tags || 120} isResizable={true} allowCellsRecycling={true} />
          <Column columnKey="lastResponseDate" header={<Cell>Last Response Submission</Cell>} cell={({ rowIndex }) => (
            <Cell>
              {moment(rows[rowIndex].lastResponseDate).format('D MMM YYYY h:mmA')}
            </Cell>
            ) } width={columnWidths.lastResponseDate || 130} isResizable={true} allowCellsRecycling={true} />
          <Column columnKey="organization" header={<Cell>Organization</Cell>} cell={({ rowIndex }) => (
            <Cell>
              {rows[rowIndex].organization}
            </Cell>
            ) } width={columnWidths.organization || 130} isResizable={true} allowCellsRecycling={true} />
        </Table>
      </div>
    );
  }
}

Results = connect(
  state => ({
    users: state.results.users,
    data: state.results.data,
    query: state.results.query,
    columnWidths: state.results.columnWidths
  }),
  {
    fetchUsers,
    setData,
    setColumnWidth,
    setQuery
  }
)(Authenticated(Results));

export default Dimensions()(Results);
