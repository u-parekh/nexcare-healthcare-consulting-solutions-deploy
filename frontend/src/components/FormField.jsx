<<<<<<< HEAD
const base = "mt-2 w-full max-w-full min-w-0 box-border px-4 py-3 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm";
=======
const base = "mt-2 w-full px-4 py-3 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-sm";
>>>>>>> 0132e632f4d84b27adc83a6cd775e0705420d3a7

export const FormField = ({ id, label, error, as = "input", children, ...props }) => {
  const Comp = as;
  return (
<<<<<<< HEAD
    <div className="w-full min-w-0">
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label} *</label>
=======
    <div>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label} *</label>
>>>>>>> 0132e632f4d84b27adc83a6cd775e0705420d3a7
      <Comp id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
        className={`${base} ${error ? "border-destructive" : "border-border"}`} {...props}>
        {children}
      </Comp>
<<<<<<< HEAD
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-destructive break-words" data-testid={`${id}-error`}>{error}</p>}
=======
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-destructive" data-testid={`${id}-error`}>{error}</p>}
>>>>>>> 0132e632f4d84b27adc83a6cd775e0705420d3a7
    </div>
  );
};

export default FormField;
