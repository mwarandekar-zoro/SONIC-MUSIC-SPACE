import styles from './Slider.module.css'

/** Styled native range input: keyboard, touch and screen readers work for free. */
export default function Slider({ value, min = 0, max = 1, step = 0.01, onChange, label, ...rest }) {
  const fill = ((value - min) / (max - min)) * 100
  return (
    <input
      className={styles.slider}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={label}
      style={{ '--fill': `${fill}%` }}
      onChange={(e) => onChange(Number(e.target.value))}
      {...rest}
    />
  )
}
