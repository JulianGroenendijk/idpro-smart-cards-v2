import { CardItem } from './CardItem';

export const CardsList = ({ cards, onCardClick }) => {
  return (
    <div className="lg:col-span-3">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Cards</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {cards.map(card => (
              <CardItem
                key={card.id}
                card={card}
                onClick={onCardClick}
              />
            ))}
            
            {cards.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No cards yet. Create your first card!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
