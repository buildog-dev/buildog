import update from "immutability-helper";
import type { FC } from "react";
import { useCallback } from "react";
import { Card } from "./drag-drop-card";
import { Button } from "@ui/components/button";
import { Textarea } from "@ui/components/textarea";
import { X, LockSimple, LockSimpleOpen } from "@ui/components/react-icons";

export interface Item {
  id: string;
  value: string;
  lock: boolean;
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

  const textAreaHandler = (id: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCards((prevCards: Item[]) => {
      let copyCards = [...prevCards];
      let cardIndex = prevCards.findIndex((card) => card.id == id);

      copyCards[cardIndex].value = e.target.value;
      return copyCards;
    });
  };

  const removeCard = (index: number) => {
    setCards((prevCards: Item[]) => {
      let copyCards = [...prevCards];
      copyCards.splice(index, 1);
      return copyCards;
    });
  };

  const toggleLock = (id: string, toggle: boolean) => {
    setCards((prevCards: Item[]) => {
      let copyCards = [...prevCards];
      let cardIndex = prevCards.findIndex((card) => card.id == id);

      copyCards[cardIndex].lock = !toggle;
      return copyCards;
    });
  };

  const renderCard = useCallback((card: Item, index: number) => {
    return (
      <Card key={card.id} index={index} id={card.id} moveCard={moveCard}>
        <div className="flex p-1 gap-2">
          <Textarea
            className="disabled:border-orange-100 ring:border-green-400"
            disabled={card.lock}
            value={card.value}
            onChange={(e) => textAreaHandler(card.id, e)}
          />
          <div className="flex gap-2 flex-col">
            <Button
              variant="destructive"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeCard(index)}
            >
              <X className="h-3 w-3" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-6 w-6"
              onClick={() => toggleLock(card.id, card.lock)}
            >
              {card.lock ? (
                <LockSimple className="h-3 w-3" />
              ) : (
                <LockSimpleOpen className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    );
  }, []);

  return <div className="space-y-4">{cards?.map((card, i) => renderCard(card, i))}</div>;
};

export default DragDropList;
