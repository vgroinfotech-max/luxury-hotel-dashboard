

export default function AppShell({ userRole, children }) {
  return (
    <div className="app-shell">
      
      <main className="app-content">
        {children}
      </main>
    </div>
  );
}
