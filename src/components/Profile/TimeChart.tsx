import { useSession } from '@supabase/auth-helpers-react';
import { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import useSWR from 'swr';
import { Time, UserTimes } from 'types';
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

  const { data: userTimes, error: userTimesError } = useSWR<UserTimes[]>(
    `/api/times/getUserTimes?id=${session?.user.id}&track=13`,
    fetcher
  );

  if (userTimesError) return <div>failed to load</div>;
  if (!userTimes) return <div>loading...</div>;

  const parseData = (data: UserTimes[]) => {
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
        label: userTimes[0].track,
        data: parseData(userTimes),
        borderColor: 'rgb(169, 208, 255)',
        backgroundColor: 'rgb(255, 255, 255)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    elements: {
      point: {
        radius: 5,
      },
    },
    layout: {
      autoPadding: true,
    },

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
      tooltip: {
        callbacks: {
          label: (context) => {
            const minutes = Math.floor(context.parsed.y / 60);
            const seconds = Math.floor(context.parsed.y % 60);
            const milliseconds = Math.round(
              (context.parsed.y % 1) * 1000
            ).toString();
            return `${minutes}:${seconds}.${milliseconds.padStart(3, '0')}`;
          },
        },
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: 'Your lap times over time',
        color: 'white',
        font: {
          size: 14,
        },
      },
    },
  };

  return <Line data={data} options={options} height="500px" width="800px" />;
};

export default TimeChart;
