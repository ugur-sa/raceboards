import { useSession } from '@supabase/auth-helpers-react';
import { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import useSWR from 'swr';
import { Time } from 'types';
import {
  Chart as ChartJS,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TimeChart = () => {
  const session = useSession();
  const [trackName, setTrackName] = useState<string>('');

  const { data: userTimes, error: userTimesError } = useSWR<Time[]>(
    `/api/times/getUserTimes?id=${session?.user.id}&track=1`,
    fetcher
  );

  if (userTimesError) return <div>failed to load</div>;
  if (!userTimes) return <div>loading...</div>;

  if (userTimes !== undefined) {
    fetch(`/api/track/getTrackById?id=${userTimes![0].track_id}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setTrackName(data.name);
      });
  }

  const parseData = (data: Time[]) => {
    const parsedData = data.map((time) => {
      return {
        x: new Date(time.created_at),
        y: time.time_in_ms / 1000,
      };
    });
    return parsedData;
  };

  const labels = userTimes.map((time) => {
    return new Date(time.created_at).toLocaleDateString();
  });

  const data = {
    labels,
    datasets: [
      {
        label: trackName,
        data: parseData(userTimes),
        borderColor: 'rgb(169, 208, 255)',
        backgroundColor: 'rgb(255, 255, 255)',
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
        },
      },
      y: {
        title: {
          display: true,
        },
        ticks: {
          callback: (value) => {
            const minutes = Math.floor(+value / 60);
            const seconds = Math.floor(+value % 60);
            return `${minutes}:${seconds}.000`;
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Your lap times over time',
      },
    },
  };

  return <Line data={data} options={options} height="500px" width="800px" />;
};

export default TimeChart;
