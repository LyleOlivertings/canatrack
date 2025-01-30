export default function Timeline({ timeline }) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Growth Timeline</h2>
        <div className="relative">
          {timeline?.map((event, index) => (
            <div key={index} className="mb-6 pl-6 border-l-4 border-green-theme-500 relative">
              <div className="absolute w-4 h-4 bg-green-theme-500 rounded-full -left-[10px] top-4" />
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg">{event.event}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                {event.notes && (
                  <p className="text-gray-700">{event.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }