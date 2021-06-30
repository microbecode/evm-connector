import "../styles/alert.scss";

type Props = {
  message: string;
  dismiss: () => void;
};

export function NetworkErrorMessage({ message, dismiss }: Props) {
  return (
    <div className="alert alert-danger" role="alert">
      <strong>{message}</strong>
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={dismiss}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}
