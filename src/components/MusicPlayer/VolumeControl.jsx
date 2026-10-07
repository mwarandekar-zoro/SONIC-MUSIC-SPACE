import { useVisualizerStore } from '../../store/visualizerStore'
import Slider from '../UI/Slider'
import { MuteIcon, VolumeIcon } from '../UI/Icons'
import styles from './MusicPlayer.module.css'

export default function VolumeControl() {
  const volume = useVisualizerStore((s) => s.volume)
  const muted = useVisualizerStore((s) => s.muted)
  const setVolume = useVisualizerStore((s) => s.setVolume)
  const toggleMuted = useVisualizerStore((s) => s.toggleMuted)
  const silent = muted || volume === 0

  return (
    <div className={styles.volume}>
      <button className={styles.btn} onClick={toggleMuted} aria-label={silent ? 'Unmute' : 'Mute'} aria-pressed={silent} title="Mute">
        {silent ? <MuteIcon /> : <VolumeIcon />}
      </button>
      <div className={styles.volumeSlider}>
        <Slider label="Volume" value={silent ? 0 : volume} min={0} max={1} step={0.01} onChange={setVolume} />
      </div>
    </div>
  )
}
