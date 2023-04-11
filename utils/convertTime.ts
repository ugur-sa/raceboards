const convertTime = (time: number) => {
  if (time === 0 || time === null) {
    return 'DNS';
  }
  const seconds = Math.floor(time / 1000);
  const minutes = Math.floor(seconds / 60);
  const milliseconds = (time % 1000).toString().padStart(3, '0');
  const secondsLeft = seconds % 60;

  if (minutes > 0) {
    return `${minutes}:${
      secondsLeft < 10 ? '0' : ''
    }${secondsLeft}.${milliseconds}`;
  } else {
    return `${secondsLeft}.${milliseconds}`;
  }
};

export default convertTime;
