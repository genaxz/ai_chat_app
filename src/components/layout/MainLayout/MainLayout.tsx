import { useState } from 'react';
import Sidebar from '../Sidebar';

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="made-u-display-flex made-u-height-100vh">
      <div
        className={`made-u-transition-all ${
          isSidebarOpen ? 'made-u-width-300px' : 'made-u-width-0'
        }`}
      >
        {isSidebarOpen && <Sidebar />}
      </div>

      <div className="made-u-flex-grow-1 made-u-display-flex made-u-flex-direction-column made-u-overflow-hidden">
        <header className="made-u-padding-4 made-u-border-bottom-1 made-u-border-color-neutral-03 made-u-display-flex made-u-align-items-center">
          <button
            className="made-c-button made-c-button--icon made-c-button--transparent made-u-margin-right-2"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <svg
              className="made-c-button__icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d={
                  isSidebarOpen
                    ? 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z'
                    : 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z'
                }
              />
            </svg>
          </button>
          <h1 className="made-u-h4 made-u-margin-0">AI Chat</h1>
        </header>
        <main className="made-u-flex-grow-1 made-u-display-flex made-u-flex-direction-column made-u-overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
