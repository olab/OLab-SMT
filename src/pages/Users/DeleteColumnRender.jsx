const Component = ({
  fetchSmth, params,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const doSmth= async () => {
      setIsLoading(true);
      await fetchSmth(params.row);
      setIsLoading(false);
  };

  return (
      <Tooltip title='Some title'></Tooltip>
  );
};

export default Component;