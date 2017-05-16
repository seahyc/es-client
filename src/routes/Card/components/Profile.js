import React from 'react';
import { Chart } from 'react-google-charts';

const colors = ['#FF6412', '#FD8933', '#E8AC43', '#FFD940', '#E8E33E', '#B8FF52', '#8AEA7C'];
const egColors = ['#DC3912', '#3366CC', '#FF9900', '#109618'];
const egColorsFaded = ['#F98174', '#B2D5E7', '#EEEB97', '#AAE28D'];
const fadedOrNot = function fadedOrNot(categories) {
  const total = categories.reduce((runningTotal, cat) => runningTotal + cat.average, 0);
  const percentage = categories.map(cat => (cat.average / total) * 100);
  const faded = percentage.map(percentage => Boolean(percentage < 22.5));
  const colors = faded.map((faded, index) => faded ? egColorsFaded[index] : egColors[index]);
  return colors.map(color => ({ color: color }));
};

const Profile = props => (
  <div>
    <div className="panel">
      <div className="panel-heading orange">
        <h2 className="panel-title">{props.name}</h2>
      </div>
      <div className="panel-body">
        <div>
          <h4>{props.CAS.name}</h4>
          <Chart chartType="ColumnChart" graph_id={props.CAS.test} options={{ title: 'Attributes Percentile' }}
                 width="100%" height="400px"
                 data={[['Category', 'Percentile', { role: 'style' }]].concat(props.CAS.categories.map(cat =>
                   [cat.name, cat.percentile, colors[cat.order - 1]]))} legend_toggle={false} />
          <table>
            <tr>
              <td>
                <h4>{props.EG.name}</h4>
                <Chart chartType="PieChart" graph_id={props.EG.test} options={{ title: 'Profile Breakdown',
                  slices: fadedOrNot(props.EG.categories) }}
                       width="350px" height="200px"
                       data={[['Category', 'Average']].concat(props.EG.categories.map(cat =>
                         [cat.name, cat.average]))} legend_toggle={true} />
              </td>
              <td>
                <h4>{props.GRIT.name}</h4>
                <div className="center">
                  <Chart chartType="Gauge" graph_id={props.GRIT.test} options={{
                    max: 5, min: 0,
                    redFrom: 0, redTo: 2,
                    yellowFrom: 2, yellowTo: 4,
                    greenFrom: 4, greenTo: 5,
                    majorTicks: [0, 1, 2, 3, 4, 5],
                    minorTicks: 10
                  }}
                         width="280px" height="200px"
                         data={[['Category', 'Score']].concat(props.GRIT.categories.map(cat =>
                           [cat.category, cat.score]))}
                         legend_toggle={true} />
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>);

Profile.propTypes = {
  CAS: React.PropTypes.object,
  EG: React.PropTypes.object,
  GRIT: React.PropTypes.object,
  name: React.PropTypes.string
};

export default Profile;
