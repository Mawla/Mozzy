const TemplatesLoading = () => {
  return (
    <div className="p-6">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
      <div className="grid gap-4">
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default TemplatesLoading;
