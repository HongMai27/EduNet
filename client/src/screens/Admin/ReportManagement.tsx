import React, { useState, useEffect } from "react";
import axios from "axios";
import { IReport } from "../../types/IReport";
import { Link } from "react-router-dom";


const ReportManagement: React.FC = () => {
  const [reports, setReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all reports
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:5000/api/posts/getallreport");
        setReports(response.data);
      } catch (err) {
        setError("Failed to fetch reports data.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Reports List</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Reporter</th>
            <th className="border border-gray-300 px-4 py-2">Entity Type</th>
            <th className="border border-gray-300 px-4 py-2">Reported Entity</th>
            <th className="border border-gray-300 px-4 py-2">Reason</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td className="border border-gray-300 px-4 py-2">
                <Link to={`/report/${report._id}`} className="text-blue-500 hover:underline">
                  {report._id}
                </Link>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {report.reporter.username} ({report.reporter.email})
              </td>
              <td className="border border-gray-300 px-4 py-2">{report.entityType}</td>
              <td className="border border-gray-300 px-4 py-2">
                {report.entityType === "Post"
                  ? report.reportedEntity?.content || "Deleted Post"
                  : report.reportedEntity?.username || "Deleted User"}
              </td>
              <td className="border border-gray-300 px-4 py-2">{report.reason}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(report.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportManagement;
