export default function PageWrapper({ children }) {
  return (
    <div className="page-wrapper">
      <div className="page-container">{children}</div>
    </div>
  );
}
