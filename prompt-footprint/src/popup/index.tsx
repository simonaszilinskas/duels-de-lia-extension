import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { DailyPromptData, getHistoricalData, getTodayData } from "../utils/storage";
import { AI_MODELS, calculateFootprint, calculateTotalCarbon, carbonToEquivalent } from "../utils/carbonCalculation";

import "./style.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function IndexPopup() {
  const [todayData, setTodayData] = useState<DailyPromptData | null>(null);
  const [weekData, setWeekData] = useState<DailyPromptData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const today = await getTodayData();
      const history = await getHistoricalData(7);
      console.log("[Popup] Loaded today's data:", today);
      console.log("[Popup] Loaded history data:", history);
      setTodayData(today);
      setWeekData(history);
      setLoading(false);
    }

    // Load data immediately
    loadData();
    
    // Set up a listener for storage changes
    const handleStorageChange = (changes: {[key: string]: chrome.storage.StorageChange}) => {
      console.log("[Popup] Storage changed:", changes);
      // Reload data when storage changes
      loadData();
    };
    
    chrome.storage.onChanged.addListener(handleStorageChange);
    
    // Clean up listener when component unmounts
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  // Calculate carbon footprint for today
  const todayCarbon = todayData 
    ? calculateTotalCarbon(todayData.prompts)
    : 0;
  
  // Calculate carbon footprint for the week
  const weekCarbon = weekData.reduce((total, day) => {
    return total + calculateTotalCarbon(day.prompts);
  }, 0);

  // Prepare data for the service breakdown chart
  const serviceData = {
    labels: todayData ? Object.keys(todayData.prompts).map(key => AI_MODELS[key]?.name || key) : [],
    datasets: [
      {
        data: todayData 
          ? Object.entries(todayData.prompts).map(([key, count]) => count)
          : [],
        backgroundColor: todayData
          ? Object.keys(todayData.prompts).map(key => AI_MODELS[key]?.color || '#6B7280')
          : [],
        borderWidth: 0,
      },
    ],
  };

  // Prepare data for the weekly usage chart
  const weeklyData = {
    labels: weekData.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString(undefined, { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Daily Prompts',
        data: weekData.map(day => day.totalCount),
        backgroundColor: '#10B981',
      },
    ],
  };

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <div className="container">
      <header>
        <h1>Prompt Footprint</h1>
      </header>

      <section className="today-summary">
        <h2>Today's Usage</h2>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-value">{todayData?.totalCount || 0}</span>
            <span className="stat-label">Prompts</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{todayCarbon.toFixed(1)}g</span>
            <span className="stat-label">CO₂e</span>
          </div>
        </div>
        
        <div className="carbon-equivalent">
          {carbonToEquivalent(todayCarbon)}
        </div>
      </section>
      
      {todayData?.totalCount ? (
        <section className="service-breakdown">
          <h3>Service Breakdown</h3>
          <div className="chart-container">
            <Doughnut 
              data={serviceData} 
              options={{
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      boxWidth: 12,
                      font: {
                        size: 10
                      }
                    }
                  }
                },
                cutout: '70%'
              }}
            />
          </div>
        </section>
      ) : (
        <div className="no-data">No prompts tracked today</div>
      )}

      <section className="weekly-stats">
        <h3>Weekly Overview</h3>
        <div className="weekly-total">
          <span>Total: </span>
          <strong>{weekData.reduce((sum, day) => sum + day.totalCount, 0)} prompts</strong>
          <span> / </span>
          <strong>{weekCarbon.toFixed(1)}g CO₂e</strong>
        </div>
        
        <div className="chart-container">
          <Bar 
            data={weeklyData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0
                  }
                }
              }
            }}
          />
        </div>
      </section>
      
      <footer>
        <a 
          href="https://github.com/example/prompt-footprint" 
          target="_blank"
          rel="noreferrer"
        >
          Learn about our carbon estimate methodology
        </a>
      </footer>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<IndexPopup />);
}