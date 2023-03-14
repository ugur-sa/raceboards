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
    'rgb(237, 60, 60)',
    'rgb(26, 255, 0)',
    'rgb(51, 118, 242)',
    'rgb(250, 183, 33)',
    'rgb(213, 3, 228)',
    'rgb(2, 207, 176)',
    'rgb(240, 152, 0)',
    'rgb(72, 252, 255)',
    'rgb(171, 234, 0)',
    'rgb(128, 0, 255)',
    'rgb(5, 0, 92)',
    'rgb(59, 0, 0)',
    'rgb(255, 0, 179)',
    'rgb(0, 90, 92)',
    'rgb(255, 255, 255)',
    'rgb(0, 0, 0)',
    'rgb(78, 78, 78)',
    'rgb(120, 104, 0)',
    'rgb(0, 69, 104)',
    'rgb(112, 32, 69)',
  ];

  const datasets = gaps.playerGaps.map((gap, index) => {
    return {
      label: gap.player,
      data: parseData(gap.gaps),
      borderColor: colors[index],
      backgroundColor: 'white',
      fill: false,
      tension: 0.1,
    };
  });

  const labels = gaps.playerGaps[0].gaps.map((gap, index) => {
    if (gaps.playerGaps[0].gaps.length > 20) {
      if (index % 2 === 0) {
        if (index === 0) return 'Start';
        if (index === gaps.playerGaps[0].gaps.length - 1) return 'Finish';
        return `Lap ${index}`;
      }
    } else {
      if (index === 0) return 'Start';
      if (index === gaps.playerGaps[0].gaps.length - 1) return 'Finish';
      return `Lap ${index + 1}`;
    }
  });

  const data = {
    labels,
    datasets: datasets,
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 5,
        hoverRadius: 8,
        borderWidth: 2,
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
          boxHeight: 10,
          boxWidth: 20,
        },
      },
      title: {
        display: true,
        text: 'Gaps',
        color: 'white',
        font: {
          size: 20,
        },
      },
    },
  };

  return (
    <div className="flex max-h-[400px] min-h-[200px] w-screen justify-center md:max-h-[1000px] md:min-h-[800px] md:w-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default GapsChart;
