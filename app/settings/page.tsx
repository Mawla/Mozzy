import { JsonEnrichButton } from "../components/JsonEnrichButton";
import ErrorBoundary from "../components/ErrorBoundary";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <ErrorBoundary fallback={<p>Error loading JSON Enrich Button</p>}>
        <JsonEnrichButton />
      </ErrorBoundary>
    </div>
  );
}
