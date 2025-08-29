import type { TabType } from "../tabs/types";

type SampleProps = {
  tab: TabType;
};

export const Sample = ({
  tab
}: SampleProps) => {

  return (
    <div className="block relative overflow-y-auto overflow-x-hidden">
      <div className="card flex-col min-h-full">
        <h1>
          {tab.name}
        </h1>
        <div className="w-full flex-1 flex">
          {tab.component}
        </div>
      </div>
    </div>
  );
};