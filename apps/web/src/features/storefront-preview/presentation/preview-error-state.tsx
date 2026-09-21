type PreviewErrorStateProps = Readonly<{
  message: string;
}>;

export function PreviewErrorState({ message }: PreviewErrorStateProps) {
  return (
    <div
      aria-atomic="true"
      aria-live="assertive"
      className="preview-state preview-state-error"
      role="alert"
    >
      <span aria-hidden="true">✦</span>
      <h3>Esta experiência fez uma pausa</h3>
      <p>{message}</p>
    </div>
  );
}
