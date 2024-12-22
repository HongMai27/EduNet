import React, { useState, useEffect } from "react";
import { deletePost } from "../../services/postService";
import { ArcElement, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);


const StatisticalPage: React.FC = () => {
    const [pieData1, setPieData1] = useState({
        labels: ["Low (≤40)", "Normal (41-70)", "Good (>70)"],
        datasets: [
          {
            label: "Point",
            data: [0, 0, 0],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      });

      const [barData, setBarData] = useState({
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        datasets: [
          {
            label: "Số người hoạt động",
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: "#4BC0C0",
            borderColor: "#36A2EB",
            borderWidth: 1,
          },
        ],
      });
      useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await axios.get("http://localhost:5000/api/auth/getpoint");
            const users = response.data;
    
            // Phân loại điểm
            let low = 0;
            let medium = 0;
            let good = 0;
    
            // Đếm số người dùng hoạt động trong tuần
            const activityCount = Array(7).fill(0);
    
            users.forEach((user: any) => {
              // Phân loại điểm
              if (user.point <= 40) {
                low++;
              } else if (user.point <= 70) {
                medium++;
              } else {
                good++;
              }
    
              // Đếm hoạt động theo ngày
              if (user.lastActive) {
                const dayOfWeek = new Date(user.lastActive).getDay();
                activityCount[dayOfWeek]++;
              }
            });
    
            // Cập nhật dữ liệu pie chart
            setPieData1((prevData) => ({
              ...prevData,
              datasets: [
                {
                  ...prevData.datasets[0],
                  data: [low, medium, good],
                },
              ],
            }));
    
            // Cập nhật dữ liệu bar chart
            setBarData((prevData) => ({
              ...prevData,
              datasets: [
                {
                  ...prevData.datasets[0],
                  data: activityCount,
                },
              ],
            }));
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
    
        fetchUserData();
      }, []);


    
      const pieData2 = {
        labels: ["Product X", "Product Y", "Product Z"],
        datasets: [
          {
            label: "Dataset 2",
            data: [150, 250, 200],
            backgroundColor: ["#4BC0C0", "#9966FF", "#FF9F40"],
            hoverBackgroundColor: ["#4BC0C0", "#9966FF", "#FF9F40"],
          },
        ],
      };
    
      const pieData3 = {
        labels: ["Region 1", "Region 2", "Region 3"],
        datasets: [
          {
            label: "Dataset 3",
            data: [400, 300, 200],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      };



  return (
    <div className="mt-20 ml-64">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Statistical</h2>
      <div className="p-6 space-y-6">
      {/* Hàng trên: Biểu đồ tròn */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
        <h2 className="text-center">Points</h2>
          <Doughnut data={pieData1} />
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
          <Doughnut data={pieData2} />
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
          <Doughnut data={pieData3} />
        </div>
      </div>

      {/* Hàng dưới: Biểu đồ cột */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
        <Bar data={barData} />
      </div>
    </div>
    </div>
  );
};

export default StatisticalPage;
