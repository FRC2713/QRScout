type SectionProps = {
  children?: React.ReactNode;
  title?: string;
};

export function Section(props: SectionProps) {
  return (
    <div
      className="mb-4 rounded bg-yellow-100 shadow-md dark:bg-yellow-600"
      key={props.title}
    >
      {props.title && (
        <div className="mb-2 rounded-t bg-red-rhr p-1 shadow-md">
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
