const Topbar = () => {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-sm font-medium text-gray-700">
        Welcome back
      </h1>

      <div className="text-sm text-gray-600">
        user@email.com
      </div>
    </header>
  );
};

export default Topbar;