interface PersonaProps {
  primary_text: string;
  secondary_text?: string;
  icon?: string;
}

export default function Provider(props: PersonaProps) {
  return (
    <div className="flex flex-row items-center gap-2">
      <span className="flex grow-0 shrink-0 size-12 bg-gray-300 rounded-full"></span>
      <div className="flex flex-col">
        <p>{props.primary_text}</p>
        <p>{props.secondary_text}</p>
      </div>
    </div>
  );
}
