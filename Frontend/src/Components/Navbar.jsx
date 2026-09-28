const Navbar = () => {
  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📝</span>
          <h1 className="text-2xl font-bold tracking-wide">TodoTracker</h1>
        </div>
        <nav aria-label="Main Navigation">
          <ul className="flex gap-6 font-medium text-sm">
            <li className="hover:text-indigo-200 transition cursor-pointer">Tasks</li>
            <li className="hover:text-indigo-200 transition cursor-pointer">About</li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;