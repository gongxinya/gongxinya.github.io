// DraggableCard.js
import React, {useState} from 'react';
import { useDrag, useDrop } from 'react-dnd';

const DraggableCard = ({ cardId, children }) => {
      //Define a state to store the card order
  const [cardOrder, setCardOrder] = useState([
    'patientFlow',
    'resourceOccupation',
    'patientNumberTrend',
    'taskTimeSpent',
  ]);

    const [, drag] = useDrag({
      type: 'CARD',
      item: { id: cardId },
    });
  
    const [, drop] = useDrop({
      accept: 'CARD',
      hover(item) {
        const draggedIndex = cardOrder.indexOf(item.id);
        const dropIndex = cardOrder.indexOf(cardId);
  
        if (draggedIndex === dropIndex) {
          return;
        }
  
        const newCardOrder = Array.from(cardOrder);
        newCardOrder.splice(draggedIndex, 1);
        newCardOrder.splice(dropIndex, 0, item.id);
  
        setCardOrder(newCardOrder);
      },
    });
  
    return (
      <div ref={(node) => drag(drop(node))} style={{ cursor: 'move' }}>
        {children}
      </div>
    );
  };
  

export default DraggableCard;
