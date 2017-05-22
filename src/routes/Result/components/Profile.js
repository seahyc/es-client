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
    {props.profile.map(test => (
      <div className="panel" key={test.test}>
        <div className="panel-heading orange">
          <h2 className="panel-title">{test.name}</h2>
        </div>
        <div className="panel-body">
          {test.test === 'EG' ? (
            <div>
              <Chart chartType="PieChart" graph_id={test.test} options={{ title: 'Profile Breakdown',
                slices: fadedOrNot(test.categories) }}
                 width="100%" height="60vh"
                 data={[['Category', 'Average']].concat(test.categories.map(cat =>
                   [cat.name, cat.average]))} legend_toggle={true} />
            </div>
            ) : null}
          {test.test === 'CAS' ? (
            <div>
              <Chart chartType="ColumnChart" graph_id={test.test} options={{ title: 'Attributes Percentile' }}
                     width="100%" height="80vh"
                     data={[['Category', 'Percentile', { role: 'style' }]].concat(test.categories.map((cat, index) =>
                       [cat.name, cat.percentile, egColors[Math.floor(index / 3)]]))} legend_toggle={true} />
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Percentile Band</th>
                  </tr>
                </thead>
                <tbody>
                  {test.categories.map((cat, index) => (
                    <tr key={cat.category} style={{ backgroundColor: egColorsFaded[Math.floor(index / 3)] }}>
                      <td><strong>{cat.name}</strong></td>
                      <td>{cat.band}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          ) : null}

          {test.test === 'GRIT' ? (
            <div>
              <div className="center">
                <Chart chartType="Gauge" graph_id={test.test} options={{
                  max: 5, min: 0,
                  redFrom: 0, redTo: 2,
                  yellowFrom: 2, yellowTo: 4,
                  greenFrom: 4, greenTo: 5,
                  majorTicks: [0, 1, 2, 3, 4, 5],
                  minorTicks: 10
                }}
                       width="100%" height="60vh"
                       data={[['Category', 'Score']].concat(test.categories.map(cat =>
                         [cat.category, cat.score]))}
                       legend_toggle={true} />
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Grit Score (over 5)</th>
                  </tr>
                </thead>
                <tbody>
                  {test.categories.map(cat => (
                    <tr key={cat.category} style={{
                      backgroundColor: colors[Math.round(cat.score / 5 * 7) - 1]
                    }}>
                      <td><strong>{cat.name} ({cat.category})</strong></td>
                      <td>{cat.score} / 5</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          ) : null}
        </div>
      </div>
    ))}
  </div>);

Profile.propTypes = {
  profile: React.PropTypes.array.isRequired,
};

export default Profile;
