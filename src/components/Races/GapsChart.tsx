import { useSession } from '@supabase/auth-helpers-react';
import { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import useSWR from 'swr';
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
import { PlayerGaps } from 'types';

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

type Gaps = {
  playerGaps: PlayerGaps[];
};

const GapsChart: React.FC<{ race_id: string }> = ({ race_id }) => {
  const { data: gaps, error: gapsError } = useSWR<Gaps>(
    `/api/races/getGaps?id=${race_id}`,
    fetcher
  );

  if (gapsError) return <div>failed to load</div>;
  if (!gaps) return <div>loading...</div>;

  const parseData = (data: number[]) => {
    const parsedData = data.map((time, index) => {
      return {
        x: index,
        y: data[index],
      };
    });
    return parsedData;
  };

  const colors = [
    'rgb(255, 0, 0)',
    'rgb(26, 255, 0)',
    'rgb(0, 8, 255)',
    'rgb(250, 233, 0)',
    'rgb(255, 255, 255)',
    'rgb(169, 208, 255)',
    'rgb(255, 255, 255)',
    'rgb(169, 208, 255)',
    'rgb(255, 255, 255)',
    'rgb(169, 208, 255)',
    'rgb(255, 255, 255)',
    'rgb(169, 208, 255)',
    'rgb(255, 255, 255)',
    'rgb(169, 208, 255)',
    'rgb(255, 255, 255)',
    'rgb(169, 208, 255)',
  ];

  const datasets = gaps.playerGaps.map((gap, index) => {
    return {
      label: gap.player,
      data: parseData(gap.gaps),
      borderColor: colors[index],
      backgroundColor: 'rgb(255, 255, 255)',
      fill: false,
      tension: 0.1,
    };
  });

  const labels = gaps.playerGaps[0].gaps.map((gap, index) => {
    if (index === 0) return 'Start';
    if (index === gaps.playerGaps[0].gaps.length - 1) return 'Finish';
    return `Lap ${index}`;
  });

  const data = {
    labels,
    datasets: datasets,
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
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        reverse: true,
        title: {
          display: true,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          callback: (value) => {
            return +value / 1000 + 's';
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset?.label} - ${context.parsed.y / 1000}s`;
          },
        },
      },
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
      },
    },
  };

  return (
    <div className="">
      <Line data={data} options={options} height="500px" width="800px" />
    </div>
  );
};

export default GapsChart;
