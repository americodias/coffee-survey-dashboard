import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CoffeeSurveySummary = () => {
  // Sample data based on survey results
  const roastData = [
    { name: 'Medium', value: 55.8 },
    { name: 'Dark', value: 21.1 },
    { name: 'Other', value: 23.1 }
  ];
  
  const brewingData = [
    { name: 'Espresso', value: 47.4 },
    { name: 'Filter/Drip', value: 23.2 },
    { name: 'Other', value: 29.4 }
  ];
  
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d'];
  
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
                  <span className="text-3xl font-bold text-blue-600 mr-2">95</span>
                  <span>respondents from Sweden (53%), Denmark (26%), Norway (21%)</span>
                </li>
                <li className="flex items-baseline">
                  <span className="text-3xl font-bold text-blue-600 mr-2">81%</span>
                  <span>are interested in coffee wellness benefits</span>
                </li>
                <li className="flex items-baseline">
                  <span className="text-3xl font-bold text-blue-600 mr-2">57%</span>
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
              <p><b>What would make people try new coffee:</b> Brand story and Availability</p>
            </div>
          </div>
        </div>
        
        {/* Right Column - Charts */}
        <div className="flex flex-col justify-between">
          <div className="h-1/2">
            <h2 className="text-xl font-semibold mb-2">Roast Preference</h2>
            <div className="h-5/6 bg-gray-50 p-2 rounded shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roastData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {roastData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="h-1/2">
            <h2 className="text-xl font-semibold mb-2">Brewing Method</h2>
            <div className="h-5/6 bg-gray-50 p-2 rounded shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={brewingData}>
                  <Bar dataKey="value" fill="#8884d8" radius={[10, 10, 0, 0]} label={({value}) => `${value}%`}>
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