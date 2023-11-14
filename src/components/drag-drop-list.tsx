import update from "immutability-helper";
import type { FC } from "react";
import { useCallback } from "react";
import { Card } from "./drag-drop-card";
import { Textarea } from "./ui/textarea";

export interface Item {
  id: string;
  value: string;
}

interface DragDropList {
  cards: Item[];
  setCards: React.Dispatch<React.SetStateAction<Item[]>>;
}

export const DragDropList: FC<DragDropList> = ({ cards, setCards }) => {
  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards: Item[]) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex] as Item],
        ],
      })
    );
  }, []);

  const textAreaHandler = (
    index: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCards((prevCards: Item[]) => {
      let copyCards = [...prevCards];
      let cardIndex = prevCards.findIndex((card) => card.id == index);

      copyCards[cardIndex].value = e.target.value;
      return copyCards;
    });
  };

  const renderCard = useCallback((card: Item, index: number) => {
    return (
      <Card key={card.id} index={index} id={card.id} moveCard={moveCard}>
        <Textarea
          value={card.value}
          onChange={(e) => textAreaHandler(card.id, e)}
        />
      </Card>
    );
  }, []);

  return <div className="space-y-4">{cards?.map((card, i) => renderCard(card, i))}</div>;
};

export default DragDropList;
