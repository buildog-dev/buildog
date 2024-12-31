import { forwardRef, useImperativeHandle, useRef } from "react";

type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProps<C extends React.ElementType, Props = {}> = React.PropsWithChildren<
  Props & AsProp<C>
> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

interface Props {
  className?: string;
  onInput?: React.FormEventHandler<HTMLElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  onSelect?: React.ReactEventHandler<HTMLElement>;
}

const Editable = forwardRef(
  <C extends React.ElementType = "div">(
    { as, className, onInput, onKeyDown, onSelect, children }: PolymorphicComponentProps<C, Props>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const Component = as || "div";
    const editorRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => editorRef.current as HTMLDivElement);

    return (
      <Component
        ref={editorRef}
        className={`p-0.5 font-mono max-w-none border outline-none dark:text-white ${className || ""}`}
        contentEditable
        onInput={onInput}
        onKeyDown={onKeyDown}
        onSelect={onSelect}
      >
        {children}
      </Component>
    );
  }
);

export default Editable;
