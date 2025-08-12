/* eslint-disable @next/next/no-img-element */
import { AuthProvider } from "../../../../packages/react/build";
import { EnvelopeOpenIcon } from "@radix-ui/react-icons";
import { ArrowLeft, GripVertical, User2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Facebook, Google, Twitter, WalletIcon } from "../../Assets/Logos";
import { useSample } from "../SampleProvider";
import { AsideContentType } from "./types";

type ChecklistItem = {
  id: AuthProvider;
  text: string;
  icon?: React.ReactNode;
  checked?: boolean;
};

const providers: ChecklistItem[] = [
  {
    id: AuthProvider.GUEST,
    text: "Guest",
    icon: <User2Icon strokeWidth={1.5} className="w-5 h-5" />,
  },
  {
    id: AuthProvider.EMAIL,
    text: "Email",
    icon: <EnvelopeOpenIcon />,
  },
  {
    id: AuthProvider.WALLET,
    text: "Wallet",
    icon: <WalletIcon />,
  },
  {
    id: AuthProvider.GOOGLE,
    text: "Google",
    icon: <Google />,
  },
  {
    id: AuthProvider.FACEBOOK,
    text: "Facebook",
    icon: <Facebook />,
    checked: true,
  },
  {
    id: AuthProvider.TWITTER,
    text: "X",
    icon: <Twitter />,
    checked: true,
  },
]

type Props = {
  setContent: (content: AsideContentType) => void;
}


export const ProvidersEdit = ({ setContent }: Props) => {
  const { sampleProviders, setSampleProviders } = useSample();

  const [list, setList] = useState<ChecklistItem[]>(
    providers
      .sort((a, b) => (sampleProviders.indexOf(b.id) - sampleProviders.indexOf(a.id)))
      .sort((a, b) => (sampleProviders.includes(a.id) ? -1 : 1))
  );
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLIElement>, index: number) => {
    event.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;

    const newList = [...list];
    const [movedItem] = newList.splice(draggingIndex, 1);
    newList.splice(index, 0, movedItem);
    setDraggingIndex(index);
    setList(newList);
  };

  const checkItem = (id: string) => {
    // setList((prevList) =>
    //   prevList.map((item) =>
    //     item.id === id ? { ...item, checked: !item.checked } : item
    //   )
    // );

    const newList = [...list];
    const itemIndex = newList.findIndex((item) => item.id === id);
    const item = newList[itemIndex];
    const checkedIndex = newList.findIndex((item) => item.checked);
    const uncheckedIndex = newList.findLastIndex((item) => !item.checked);
    if (item.checked) {
      newList[itemIndex].checked = false;
      newList.splice(checkedIndex, 0, newList.splice(itemIndex, 1)[0]);
    } else {
      newList[itemIndex].checked = true;
      newList.splice(uncheckedIndex, 0, newList.splice(itemIndex, 1)[0]);
    }
    setList(newList);
  };

  const handleDrop = () => {
    setDraggingIndex(null);
  };

  useEffect(() => {
    const newProviders = list.filter((i) => !i.checked).map((item) => (item.id));
    setSampleProviders(newProviders);
  }, [list, setSampleProviders]);

  return (
    <>
      <button className="flex items-center cursor-pointer mb-2 hover:translate-x-1 transition-all duration-300" onClick={() => setContent("main")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        <h3 className="text-lg font-semibold">
          Providers
        </h3>
      </button>
      <ul className={
        "gap-2 group w-full flex-1 relative space-y-2"
      }>
        {list.map((item, index) => (
          <li
            // style={{ order: list.findIndex((i) => i.id === item.id) }}
            key={item.id}
            draggable
            onClickCapture={(e) => { checkItem(item.id) }}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
            className={
              "bg-surface p-2 list-none rounded-md shadow overflow-hidden cursor-move border border-border transition-opacity flex h-12 items-center gap-2" +
              " " + (item.checked ? "opacity-25" : "")
            }
          >
            <GripVertical className="w-4 h-4 shrink-0 text-gray-300" />
            {item.icon && (
              <div className="w-4 h-4 flex items-center justify-center">
                {item.icon}
              </div>
            )}

            <span className={("text-xs transition-all")}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
      <div className="opacity-75 flex flex-wrap pointer-events-none mt-auto">
        <div className="w-1/2 p-1">

          <div className="p-2 text-xs shadow rounded-lg">
            Drag and drop to reorder providers
          </div>
        </div>
        <div className="w-1/2 p-1">
          <div className="p-2 text-xs shadow rounded-lg">
            Click to enable or disable providers
          </div>
        </div>
      </div>
    </>
  );
};