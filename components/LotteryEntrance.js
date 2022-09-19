import { useMoralis, useWeb3Contract } from 'react-moralis';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useNotification } from '@web3uikit/core';
import { Checkmark } from '@web3uikit/icons';
import contractInfo from '../constants';

export default function LotteryEntrance() {
  const { contractAddresses, abi } = contractInfo;
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const dispatch = useNotification();

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

  const handleNewNotification = () => {
    dispatch({
      type: 'info',
      message: 'Transaction Complete!',
      title: 'Transaction Notification',
      position: 'topR',
      icon: <Checkmark fontSize="50px" />,
    });
  };

  const handleEnterRaffleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification();
  };

  const enterRaffleHandler = async () => {
    await enterRaffle({
      onSuccess: handleEnterRaffleSuccess,
      onError: (error) => console.log(error),
    });
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
