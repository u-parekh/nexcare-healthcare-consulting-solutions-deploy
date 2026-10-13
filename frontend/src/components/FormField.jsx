const base = "mt-2 w-full px-4 py-3 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm";

export const FormField = ({ id, label, error, as = "input", children, ...props }) => {
  const Comp = as;
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label} *</label>
      <Comp id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
        className={`${base} ${error ? "border-destructive" : "border-border"}`} {...props}>
        {children}
      </Comp>
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-destructive" data-testid={`${id}-error`}>{error}</p>}
    </div>
  );
};

export default FormField;
