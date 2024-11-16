export default function TemplateLoading() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="grid gap-4">
        <div className="h-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
