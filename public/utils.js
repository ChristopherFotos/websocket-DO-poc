const wsSendFactory = (ws) => {
  return (data) => {
    ws.send(JSON.stringify(data));
  };
};
