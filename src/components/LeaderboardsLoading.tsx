const LeaderboardsLoading = () => {
  const loadingArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <table className="w-full text-center">
      <thead className="bg-gray-800 text-xs uppercase xl:text-sm">
        <tr>
          <th className="">#</th>
          <th className="">User</th>
          <th className="">🥇</th>
          <th className="">🥈</th>
          <th className="">🥉</th>
        </tr>
      </thead>
      <tbody>
        {loadingArray.map((index) => (
          <tr
            key={index}
            className="animate-pulse border-b border-slate-500 text-sm blur-sm xl:text-lg"
          >
            <td>{index}</td>
            <td>Gandalf</td>
            <td>{index + Math.floor(Math.random() * 10)}</td>
            <td>{index + Math.floor(Math.random() * 10)}</td>
            <td>{index + Math.floor(Math.random() * 10)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaderboardsLoading;
