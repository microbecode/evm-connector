type Props = {
  text: string;
  dismiss: () => void;
};

export const Notification = ({ text, dismiss }: Props) => {
  return (
    <div className="alert alert-info" role="alert">
      {text}
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
};
