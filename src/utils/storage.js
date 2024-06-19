export const getBidData = (network) => {
  try {
    return JSON.parse(localStorage.getItem(`bids-${network}`) ?? "{}");
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const getAskData = (network) => {
  try {
    return JSON.parse(localStorage.getItem(`asks-${network}`) ?? "{}");
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const getSequenceNumber = (network) => {
  return Number(localStorage.getItem(`sequence-${network}`) ?? "-1");
}

export const saveBidData = (network, bids) => {
  localStorage.setItem(`bids-${network}`, JSON.stringify(bids));
}

export const saveAskData = (network, asks) => {
  localStorage.setItem(`asks-${network}`, JSON.stringify(asks));
}

export const saveSequenceNumber = (network, sequence) => {
  localStorage.setItem(`sequence-${network}`, sequence.toString());
}