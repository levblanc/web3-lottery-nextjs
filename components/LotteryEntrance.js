import { useMoralis, useWeb3Contract } from 'react-moralis';
import contractInfo from '../constants';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export default function LotteryEntrance() {
  const { contractAddresses, abi } = contractInfo;
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();

  let chainId = parseInt(chainIdHex);

  let raffleAddress = null;
  if (chainId in contractAddresses) {
    raffleAddress = contractAddresses[chainId][0];
  }

  const [entranceFee, setEntranceFee] = useState('0');

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: 'getEntranceFee',
    params: {},
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      const updateUI = async () => {
        const bigNumEntranceFee = await getEntranceFee();
        let entranceFeeUpdate;

        if (bigNumEntranceFee) {
          entranceFeeUpdate = bigNumEntranceFee.toString();
          setEntranceFee(entranceFeeUpdate);
        }
      };

      updateUI();
    }
  }, [isWeb3Enabled]);

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: 'enterRaffle',
    params: {},
    msgValue: entranceFee,
  });

  const enterRaffleHandler = async () => {
    await enterRaffle();
  };

  return (
    <div>
      <div>Hi from LotteryEntrance </div>
      {raffleAddress ? (
        <div>
          <button onClick={enterRaffleHandler}>Enter Raffle</button>
          <div>
            Entrance Fee: {ethers.utils.formatUnits(entranceFee, 'ether')} ETH
          </div>
        </div>
      ) : (
        <div>No Raffle Address Detected</div>
      )}
    </div>
  );
}
