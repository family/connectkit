import React from "react";

type ReactChildArray = ReturnType<typeof React.Children.toArray>;
export function flattenChildren(children: React.ReactNode): ReactChildArray {
  const childrenArray = React.Children.toArray(children);
  return childrenArray.reduce((flatChildren: ReactChildArray, child) => {
    if ((child as React.ReactElement<unknown>).type === React.Fragment) {
      return flatChildren.concat(
        // biome-ignore lint/suspicious/noExplicitAny: React.Fragment children props require any type
        flattenChildren((child as React.ReactElement<any>).props.children),
      );
    }
    flatChildren.push(child);
    return flatChildren;
  }, []);
}
