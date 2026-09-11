"use client";

export function AutoSubmitCheckbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-[var(--color-ink-soft)]">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="h-4 w-4 rounded border-[var(--color-border)]"
      />
      {label}
    </label>
  );
}
