import React from 'react';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CoffeeSurveySummary = () => {
  // Sample data based on survey results
  const roastData = [
    { name: 'Medium', value: 55.8 },
    { name: 'Dark', value: 21.1 },
    { name: 'Other', value: 23.1 }
  ];
  
  // Updated brewing data with Espresso and Capsule merged
  const brewingData = [
    { name: 'Espresso/Capsule', value: 64.6 }, // 47.4 + 17.2 ≈ 64.6
    { name: 'Filter/Drip', value: 23.2 },
    { name: 'Other', value: 12.2 } // 100 - 64.6 - 23.2 = 12.2
  ];
  
  // Updated color scheme
  const COLORS = ['#A4343A', '#D22630', '#FFCD00', '#3F2021'];
  
  return (
    <div className="bg-white p-8 h-full flex flex-col" style={{ fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-3xl font-bold text-center mb-4">Coffee Consumption Survey Insights</h1>
      <p className="text-sm text-gray-500 text-center mb-6">95 respondents from Nordic countries • March 2025</p>
      
      <div className="grid grid-cols-2 gap-6 flex-grow">
        {/* Left Column - Key Stats */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Demographics & Preferences</h2>
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <ul className="space-y-3">
                <li className="flex items-baseline">
                  <span className="text-3xl font-bold mr-2" style={{ color: '#A4343A' }}>95</span>
                  <span>respondents from Sweden (53%), Denmark (26%), Norway (21%)</span>
                </li>
                <li className="flex items-baseline">
                  <span className="text-3xl font-bold mr-2" style={{ color: '#D22630' }}>81%</span>
                  <span>are interested in coffee wellness benefits</span>
                </li>
                <li className="flex items-baseline">
                  <span className="text-3xl font-bold mr-2" style={{ color: '#3F2021' }}>57%</span>
                  <span>drink their coffee black</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Consumer Insights</h2>
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <p className="mb-2"><b>Top purchase factors:</b> Taste, Price</p>
              <p className="mb-2"><b>Preferred location:</b> Home, followed by Work</p>
              <p className="mb-2"><b>What would make people try new coffee:</b> Brand story and Availability</p>
              <p><b>"Wow" Factors:</b> Portuguese-Nordic Fusion, Functional Benefits/Special Formulations</p>
            </div>
          </div>
        </div>
        
        {/* Right Column - Charts */}
        <div className="flex flex-col justify-between">
          <div className="h-1/2">
            <h2 className="text-xl font-semibold mb-2">Roast Preference</h2>
            <div className="h-5/6 bg-gray-50 p-4 rounded shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                  <Pie
                    data={roastData}
                    cx="50%"
                    cy="40%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roastData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="h-1/2">
            <h2 className="text-xl font-semibold mb-2">Brewing Method</h2>
            <div className="h-5/6 bg-gray-50 p-4 rounded shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={brewingData}
                  layout="vertical" 
                  margin={{ top: 10, right: 50, left: 40, bottom: 10 }}
                >
                  <XAxis type="number" domain={[0, 70]} tickFormatter={(value) => `${value}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar 
                    dataKey="value" 
                    barSize={25}
                    label={{ position: 'right', formatter: (value) => `${value}%`, fontSize: 12 }}
                  >
                    {brewingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeSurveySummary;