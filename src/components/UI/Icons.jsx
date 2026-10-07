const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true }
const stroke = { ...base, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const PlayIcon = () => (<svg {...base}><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>)
export const PrevIcon = () => (<svg {...base}><path d="M6 5h2v14H6zM20 5.7v12.6a1 1 0 0 1-1.6.8L10 13a1 1 0 0 1 0-1.6l8.4-6.5a1 1 0 0 1 1.6.8Z" /></svg>)
export const NextIcon = () => (<svg {...base}><path d="M16 5h2v14h-2zM4 5.7v12.6a1 1 0 0 0 1.6.8L14 13a1 1 0 0 0 0-1.6L5.6 4.9A1 1 0 0 0 4 5.7Z" /></svg>)
export const UploadIcon = () => (<svg {...stroke}><path d="M12 16V4m0 0-4.5 4.5M12 4l4.5 4.5M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></svg>)
export const FullscreenIcon = () => (<svg {...stroke}><path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" /></svg>)
export const SettingsIcon = () => (<svg {...stroke}><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg>)
export const KeyboardIcon = () => (<svg {...stroke}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10" /></svg>)
export const CloseIcon = () => (<svg {...stroke}><path d="M6 6l12 12M18 6 6 18" /></svg>)
export const VolumeIcon = () => (<svg {...stroke}><path d="M4 10v4h3.5L12 18V6L7.5 10H4Z" /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /></svg>)
export const MuteIcon = () => (<svg {...stroke}><path d="M4 10v4h3.5L12 18V6L7.5 10H4Z" /><path d="m16 9 5 6m0-6-5 6" /></svg>)
export const PauseIcon = () => (<svg {...base}><rect x="6" y="5" width="4" height="14" rx="1.2" /><rect x="14" y="5" width="4" height="14" rx="1.2" /></svg>)
export const SeekBackIcon = () => (<svg {...stroke}><path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4" /><path d="M9.6 10v4.4m2.4-4.4h1.6a.8.8 0 0 1 .8.8v2.8a.8.8 0 0 1-.8.8H12Z" strokeWidth="1.4" /></svg>)
export const SeekForwardIcon = () => (<svg {...stroke}><path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v4h-4" /><path d="M9.6 10v4.4m2.4-4.4h1.6a.8.8 0 0 1 .8.8v2.8a.8.8 0 0 1-.8.8H12Z" strokeWidth="1.4" /></svg>)
export const CameraIcon = () => (<svg {...stroke}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>)
