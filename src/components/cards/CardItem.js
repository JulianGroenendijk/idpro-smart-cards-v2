export const CardItem = ({ card, onClick }) => {
  return (
    <div 
      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onClick(card)}
    >
      <h4 className="font-medium text-gray-900">{card.title}</h4>
      {card.body && <p className="text-sm text-gray-600 mt-1">{card.body}</p>}
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500">
          Created: {new Date(card.createdAt).toLocaleString()}
        </p>
        <span className="text-xs text-blue-600 hover:text-blue-800">
          View Details →
        </span>
      </div>
    </div>
  );
};
