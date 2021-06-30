type Props = {
  txHash?: string;
};

export const WaitingForTransactionMessage = ({ txHash }: Props) => {
  return (
    <div className="alert alert-info" role="alert">
      Waiting for transaction <strong>{txHash?.toString()}</strong> to be mined
    </div>
  );
};
