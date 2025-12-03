const PortfolioLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-portfolio-gradient text-neutral-100 pt-16">
      {children}
    </div>
  );
};

export default PortfolioLayout;