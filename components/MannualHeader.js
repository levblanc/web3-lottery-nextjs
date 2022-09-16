import { useEffect } from 'react';
import { useMoralis } from 'react-moralis';

export default function MannualHeader() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    isWeb3EnableLoading,
    Moralis,
    deactivateWeb3,
  } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;

    if (
      typeof window !== 'undefined' &&
      window.localStorage.getItem('connected')
    ) {
      console.log('trying to enable web3');
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account is ${account}`);

      if (!account) {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('connected');
          deactivateWeb3();

          console.log(`Account is null`);
        }
      }
    });
  }, []);

  const btnClickHandler = async () => {
    await enableWeb3();

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('connected', 'injected');
    }
  };

  const getAddress = (account) => {
    return `${account.slice(0, 6)}...${account.slice(account.length - 4)}`;
  };

  return (
    <div>
      {account ? (
        <div>Connected to {getAddress(account)}</div>
      ) : (
        <button onClick={btnClickHandler} disabled={isWeb3EnableLoading}>
          Connect
        </button>
      )}
    </div>
  );
}
