export default function PageHeader({ title, subtitle, action = null }) {
  return <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h1 className="app-page-title">{title}</h1>{subtitle && <p className="app-page-subtitle">{subtitle}</p>}</div>{action}</div>;
}
