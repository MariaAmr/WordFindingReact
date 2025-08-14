import { Link, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/store";
import Loader from "../Loader/Loader";

const Dashboard = () => {
  const { token, username } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const isActive = (path: string) => location.pathname.includes(path);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">Dashboard</h1>
              <nav className="flex space-x-4">
                <Link
                  to="/dashboard/datamuse-search"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("datamuse-search")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  Word Search
                </Link>
                <Link
                  to="/dashboard/datamuse-history"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("datamuse-history")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  Search History
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <p className="text-sm text-gray-500">Welcome, {username}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
