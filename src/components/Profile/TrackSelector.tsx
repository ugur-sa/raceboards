import useSWR from 'swr';
import { Track } from 'types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TrackSelector: React.FC<{ setTrack: any }> = ({ setTrack }) => {
  const { data: tracks, error: tracksError } = useSWR<Track[]>(
    `/api/track`,
    fetcher
  );

  if (tracksError) return <div>failed to load</div>;
  if (!tracks) return <div>loading...</div>;

  const onSelectorChange = (e: any) => {
    setTrack(e.target.value);
  };

  return (
    <select
      className="select text-[10px] sm:text-sm"
      onChange={onSelectorChange}
    >
      {tracks?.map((track) => (
        <option key={track.id} value={track.id}>
          {track.name}
        </option>
      ))}
    </select>
  );
};

export default TrackSelector;
