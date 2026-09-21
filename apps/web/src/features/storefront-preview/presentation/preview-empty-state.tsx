export function PreviewEmptyState() {
  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className="preview-state preview-state-empty"
      role="status"
    >
      <span aria-hidden="true">✦</span>
      <h3>Novos olhares estão a caminho</h3>
      <p>Nossa seleção conceitual está sendo preparada.</p>
    </div>
  );
}
