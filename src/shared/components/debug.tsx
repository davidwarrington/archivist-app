export function DebugJson({
  data,
  ...props
}: React.ComponentProps<'pre'> & { data: unknown }) {
  return (
    <pre {...props}>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}
