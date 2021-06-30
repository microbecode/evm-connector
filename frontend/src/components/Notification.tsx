type Props = {
  text: string;
};

export const Notification = ({ text }: Props) => {
  return (
    <div className="alert alert-info" role="alert">
      {text}
    </div>
  );
};
