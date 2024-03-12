type SectionProps = {
  children?: React.ReactNode;
  title?: string;
  accent_color?: string;
};

export function Section(props: SectionProps) {
  let bgClassName = `mb-2 rounded-t bg-${props.accent_color != null ? props.accent_color : "gray"}-600 p-1 shadow-md`
  return (
    <div
      className="mb-4 rounded bg-gray-100 shadow-md dark:bg-gray-600"
      key={props.title}
    >
      {props.title && (
        <div className={bgClassName}>
          <h2 className="font-rhr-ns text-2xl uppercase text-white dark:text-gray-800">
            {props.title}
          </h2>
        </div>
      )}
      <div className="flex flex-col justify-start gap-2 py-2">
        {props.children}
      </div>
    </div>
  );
}
