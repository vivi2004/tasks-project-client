const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Dashboard
      </h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded shadow-sm">
          <p className="text-sm text-gray-500">Projects</p>
          <p className="text-2xl font-semibold mt-1">12</p>
        </div>

        <div className="bg-white p-5 rounded shadow-sm">
          <p className="text-sm text-gray-500">Tasks</p>
          <p className="text-2xl font-semibold mt-1">86</p>
        </div>

        <div className="bg-white p-5 rounded shadow-sm">
          <p className="text-sm text-gray-500">Jobs</p>
          <p className="text-2xl font-semibold mt-1">5 running</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;