import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ScatterChart, Scatter, ZAxis
} from 'recharts';
import Papa from 'papaparse';
import _ from 'lodash';

const CoffeeSurveyDashboard = () => {
  const [activeTab, setActiveTab] = useState('demographics');
  const [data, setData] = useState({
    demographics: {
      ageGroups: [],
      countries: [],
      wellnessInterest: []
    },
    consumption: {
      cupsPerDay: [],
      brewingMethods: [],
      roastPreferences: [],
      timingData: []
    },
    preferences: {
      factors: [],
      additives: [],
      locations: []
    },
    insights: {
      awareness: [],
      tryFactors: [],
      wowFactors: [],
      ageVsRoast: []
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        // Replace this line
        // const response = await window.fs.readFile('survey_results.csv', { encoding: 'utf8' });

        // With these lines
        //const response = await fetch('/data/survey_results.csv');
        const response = await fetch(process.env.PUBLIC_URL + '/data/survey_results.csv');
        const text = await response.text();

        const parsedData = Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });

        // Process demographic data
        const ageGroupsMap = {};
        const countriesMap = {};
        const wellnessInterestMap = {};

        parsedData.data.forEach(row => {
          if (row.age_group) {
            ageGroupsMap[row.age_group] = (ageGroupsMap[row.age_group] || 0) + 1;
          }
          if (row.country) {
            countriesMap[row.country] = (countriesMap[row.country] || 0) + 1;
          }
          if (row.interest_wellness) {
            wellnessInterestMap[row.interest_wellness] = (wellnessInterestMap[row.interest_wellness] || 0) + 1;
          }
        });

        const ageGroups = Object.keys(ageGroupsMap).map(key => ({
          name: key,
          value: ageGroupsMap[key]
        }));

        const countries = Object.keys(countriesMap).map(key => ({
          name: key,
          value: countriesMap[key]
        }));

        const wellnessInterest = Object.keys(wellnessInterestMap).map(key => ({
          name: key,
          value: wellnessInterestMap[key]
        }));

        // Process consumption data
        const cupsPerDayMap = {};
        const brewingMethodsMap = {};
        const roastPreferencesMap = {};

        parsedData.data.forEach(row => {
          if (row.cups_per_day) {
            cupsPerDayMap[row.cups_per_day] = (cupsPerDayMap[row.cups_per_day] || 0) + 1;
          }
          if (row.brewing_method) {
            brewingMethodsMap[row.brewing_method] = (brewingMethodsMap[row.brewing_method] || 0) + 1;
          }
          if (row.roast_preference) {
            roastPreferencesMap[row.roast_preference] = (roastPreferencesMap[row.roast_preference] || 0) + 1;
          }
        });

        const cupsPerDay = Object.keys(cupsPerDayMap).map(key => ({
          name: key,
          value: cupsPerDayMap[key]
        }));

        const brewingMethods = Object.keys(brewingMethodsMap).map(key => ({
          name: key,
          value: brewingMethodsMap[key]
        }));

        const roastPreferences = Object.keys(roastPreferencesMap).map(key => ({
          name: key,
          value: roastPreferencesMap[key]
        }));

        // Process timing data
        let totalMorningBefore8 = 0;
        let totalMorning8to11 = 0;
        let totalLunch11to1 = 0;
        let totalAfternoon1to5 = 0;
        let totalEveningAfter5 = 0;
        let countForTiming = 0;

        parsedData.data.forEach(row => {
          if (row.morning_before_8 !== undefined) {
            totalMorningBefore8 += row.morning_before_8;
            totalMorning8to11 += row.morning_8_11;
            totalLunch11to1 += row.lunch_11_1;
            totalAfternoon1to5 += row.afternoon_1_5;
            totalEveningAfter5 += row.evening_after_5;
            countForTiming++;
          }
        });

        const timingData = [
          { time: 'Before 8am', average: (totalMorningBefore8 / countForTiming).toFixed(2) },
          { time: '8am-11am', average: (totalMorning8to11 / countForTiming).toFixed(2) },
          { time: '11am-1pm', average: (totalLunch11to1 / countForTiming).toFixed(2) },
          { time: '1pm-5pm', average: (totalAfternoon1to5 / countForTiming).toFixed(2) },
          { time: 'After 5pm', average: (totalEveningAfter5 / countForTiming).toFixed(2) }
        ];

        // Process preference factors
        const factors = [
          { key: 'factor_taste', label: 'Taste' },
          { key: 'factor_price', label: 'Price' },
          { key: 'factor_origin', label: 'Origin' },
          { key: 'factor_organic', label: 'Organic' },
          { key: 'factor_sustainability', label: 'Sustainability' },
          { key: 'factor_brand', label: 'Brand' },
          { key: 'factor_packaging', label: 'Packaging' },
          { key: 'factor_health', label: 'Health' },
          { key: 'factor_recommendations', label: 'Recommendations' }
        ];

        const factorScores = [];
        factors.forEach(factor => {
          let total = 0;
          let count = 0;
          parsedData.data.forEach(row => {
            if (row[factor.key] !== undefined && row[factor.key] !== null) {
              total += row[factor.key];
              count++;
            }
          });
          factorScores.push({
            factor: factor.label,
            average: count > 0 ? (total / count).toFixed(2) : 0
          });
        });

        // Process additives
        const additives = [
          { key: 'add_nothing', label: 'Nothing' },
          { key: 'add_milk', label: 'Milk' },
          { key: 'add_plant_milk', label: 'Plant Milk' },
          { key: 'add_sugar', label: 'Sugar' },
          { key: 'add_artificial_sweetener', label: 'Artificial Sweetener' },
          { key: 'add_honey', label: 'Honey' },
          { key: 'add_syrup', label: 'Syrup' }
        ];

        const additiveUsage = [];
        additives.forEach(additive => {
          let count = 0;
          parsedData.data.forEach(row => {
            if (row[additive.key] === 1) {
              count++;
            }
          });
          additiveUsage.push({
            name: additive.label,
            value: count
          });
        });

        // Process location preferences
        const locationFactors = [
          { key: 'rank_home', label: 'Home' },
          { key: 'rank_work', label: 'Work' },
          { key: 'rank_cafe', label: 'Cafe' },
          { key: 'rank_restaurant', label: 'Restaurant' },
          { key: 'rank_on_the_go', label: 'On the go' }
        ];

        const locationRankings = [];
        locationFactors.forEach(location => {
          let total = 0;
          let count = 0;
          parsedData.data.forEach(row => {
            if (row[location.key] !== undefined && row[location.key] !== null) {
              total += row[location.key];
              count++;
            }
          });
          locationRankings.push({
            location: location.label,
            average: count > 0 ? (total / count).toFixed(2) : 0
          });
        });

        // Process awareness data
        const awarenessFactors = [
          { key: 'aware_antioxidant', label: 'Antioxidants' },
          { key: 'aware_alertness', label: 'Alertness & Focus' },
          { key: 'aware_disease_risk', label: 'Reduced Disease Risk' },
          { key: 'aware_athletic', label: 'Athletic Performance' },
          { key: 'aware_metabolic', label: 'Metabolic Health' },
          { key: 'aware_none', label: 'No Benefits Aware Of' }
        ];

        const awarenessData = [];
        awarenessFactors.forEach(factor => {
          let count = 0;
          parsedData.data.forEach(row => {
            if (row[factor.key] === 1) {
              count++;
            }
          });
          awarenessData.push({
            name: factor.label,
            value: count
          });
        });

        // Process try factors
        const tryFactors = [
          { key: 'try_lighter_roast', label: 'Lighter Roast' },
          { key: 'try_partnership', label: 'Brand Partnership' },
          { key: 'try_sustainability', label: 'Sustainability' },
          { key: 'try_story', label: 'Brand Story' },
          { key: 'try_wellness', label: 'Wellness Benefits' },
          { key: 'try_availability', label: 'Availability' },
          { key: 'try_recommendations', label: 'Recommendations' }
        ];

        const tryData = [];
        tryFactors.forEach(factor => {
          let count = 0;
          parsedData.data.forEach(row => {
            if (row[factor.key] === 1) {
              count++;
            }
          });
          tryData.push({
            name: factor.label,
            value: count
          });
        });

        // Process wow factors
        const wowFactors = [
          { key: 'wow_scientific', label: 'Scientific Background' },
          { key: 'wow_formulations', label: 'Special Formulations' },
          { key: 'wow_packaging', label: 'Packaging' },
          { key: 'wow_portuguese_nordic', label: 'Portuguese-Nordic Fusion' },
          { key: 'wow_active', label: 'Active Lifestyle Focus' },
          { key: 'wow_temperature', label: 'Temperature Options' },
          { key: 'wow_functional', label: 'Functional Benefits' }
        ];

        const wowData = [];
        wowFactors.forEach(factor => {
          let count = 0;
          parsedData.data.forEach(row => {
            if (row[factor.key] === 1) {
              count++;
            }
          });
          wowData.push({
            name: factor.label,
            value: count
          });
        });

        // Process age vs roast data
        const ageVsRoastMap = {};
        const ageGroupList = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
        const roastTypes = ['light', 'medium', 'dark', 'not sure', 'no preference'];

        // Initialize the map with zeros
        ageGroupList.forEach(age => {
          ageVsRoastMap[age] = {};
          roastTypes.forEach(roast => {
            ageVsRoastMap[age][roast] = 0;
          });
        });

        // Fill in the data
        parsedData.data.forEach(row => {
          if (row.age_group && row.roast_preference) {
            ageVsRoastMap[row.age_group][row.roast_preference] =
              (ageVsRoastMap[row.age_group][row.roast_preference] || 0) + 1;
          }
        });

        // Convert to array for chart
        const ageVsRoastData = ageGroupList.map(age => {
          const data = { age };
          roastTypes.forEach(roast => {
            data[roast] = ageVsRoastMap[age][roast] || 0;
          });
          return data;
        });

        setData({
          demographics: {
            ageGroups,
            countries,
            wellnessInterest
          },
          consumption: {
            cupsPerDay,
            brewingMethods,
            roastPreferences,
            timingData
          },
          preferences: {
            factors: factorScores,
            additives: additiveUsage,
            locations: locationRankings
          },
          insights: {
            awareness: awarenessData,
            tryFactors: tryData,
            wowFactors: wowData,
            ageVsRoast: ageVsRoastData
          }
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or processing data:', error);
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff8042', '#ff5252'];

  const renderDemographics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Survey Respondents by Country</h2>
        <div className="flex justify-center">
          <div className="w-full max-w-xl">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data.demographics.countries}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {data.demographics.countries.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Age Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.demographics.ageGroups}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.demographics.ageGroups.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Interest in Wellness</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.demographics.wellnessInterest}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.demographics.wellnessInterest.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Age Groups vs. Roast Preferences</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data.insights.ageVsRoast}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="light" stackId="a" fill="#8dd1e1" name="Light Roast" />
            <Bar dataKey="medium" stackId="a" fill="#8884d8" name="Medium Roast" />
            <Bar dataKey="dark" stackId="a" fill="#82ca9d" name="Dark Roast" />
            <Bar dataKey="not sure" stackId="a" fill="#ffc658" name="Not Sure" />
            <Bar dataKey="no preference" stackId="a" fill="#ff8042" name="No Preference" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderConsumption = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Cups of Coffee Per Day</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.consumption.cupsPerDay}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.consumption.cupsPerDay.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Preferred Brewing Methods</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data.consumption.brewingMethods}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Roast Preferences</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.consumption.roastPreferences}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.consumption.roastPreferences.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Coffee Consumption by Time of Day</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data.consumption.timingData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="average" stroke="#8884d8" activeDot={{ r: 8 }} name="Average Consumption" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Important Factors When Purchasing Coffee</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data.preferences.factors}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="factor" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="average" fill="#82ca9d" name="Average Importance Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Coffee Additives</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data.preferences.additives}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#ffc658" name="Number of Respondents" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Preferred Coffee Consumption Locations</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart outerRadius={90} width={500} height={300} data={data.preferences.locations}>
            <PolarGrid />
            <PolarAngleAxis dataKey="location" />
            <PolarRadiusAxis angle={30} domain={[0, 5]} />
            <Radar name="Average Ranking (lower is better)" dataKey="average" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Awareness of Coffee Health Benefits</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data.insights.awareness}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" name="Number of Respondents" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Factors That Would Make People Try New Coffee</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data.insights.tryFactors}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" name="Number of Respondents" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">"Wow" Factors for New Coffee Products</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data.insights.wowFactors}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#ffc658" name="Number of Respondents" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading survey data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Coffee Consumption Survey Results</h1>

      <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="flex flex-wrap">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'demographics' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('demographics')}
          >
            Demographics
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'consumption' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('consumption')}
          >
            Consumption Habits
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'preferences' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'insights' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('insights')}
          >
            Insights
          </button>
        </div>
      </div>

      <div className="mb-6">
        {activeTab === 'demographics' && renderDemographics()}
        {activeTab === 'consumption' && renderConsumption()}
        {activeTab === 'preferences' && renderPreferences()}
        {activeTab === 'insights' && renderInsights()}
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Key Findings</h2>
        <ul className="list-disc pl-5 space-y-1 text-left">
          <li className="text-left">
            The survey had 95 respondents, primarily from Nordic countries (Sweden: 50, Denmark: 25, Norway: 20).
          </li>
          <li className="text-left">
            Most respondents are between 25-54 years old, with the highest concentration in the 35-44 age group (31 respondents).
          </li>
          <li className="text-left">
            Medium roast coffee is preferred by the majority (55.8%), followed by dark roast (21.1%).
          </li>
          <li className="text-left">
            Espresso is the most popular brewing method (47.4%), followed by filter/drip coffee (23.2%).
          </li>
          <li className="text-left">
            Coffee consumption is highest in the morning and gradually decreases throughout the day.
          </li>
          <li className="text-left">
            Taste is by far the most important factor when purchasing coffee, followed by price.
          </li>
          <li className="text-left">
            About 56.8% of respondents drink their coffee black, while milk (30 respondents) and plant milk (23 respondents) are the most common additives.
          </li>
          <li className="text-left">
            Home is the preferred location for coffee consumption (avg. ranking: 2.1), followed by work (avg. ranking: 2.3).
          </li>
          <li className="text-left">
            81.1% of respondents are somewhat or very interested in wellness.
          </li>
          <li className="text-left">
            Brand story (42 respondents) and availability (42 respondents) are tied as the top factors that would make people try a new coffee.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CoffeeSurveyDashboard;