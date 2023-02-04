interface Error {
  statusText?: string;
  name: string;
  message: string;
  stack?: string;
}

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error?.statusText || error.message}</i>
      </p>
    </div>
  );
}
