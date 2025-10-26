import { useEffect, useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import { getDashboardUrl } from "../services/dashboardService";

function DashboardScreen() {
  const [dashboardUrl, setDashboardUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard();
  }, []);

  async function getDashboard() {
    try {
      setLoading(true);
      const { signedUrl } = await getDashboardUrl();
      setDashboardUrl(signedUrl);
      setError(null);
    } catch (err) {
      setError(
        "Error al obtener el dashboard. Verifica tu sesión o con el equipo de backend."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only"></span>
      </div>
    );

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="main-bg-color vw-100 p-0 m-0">
      <iframe
        src={dashboardUrl}
        className="w-100 h-100 border-0 mt-5"
        style={{ minHeight: "100vh" }}
        allowTransparency
      />
    </div>
  );
}

export default DashboardScreen;
