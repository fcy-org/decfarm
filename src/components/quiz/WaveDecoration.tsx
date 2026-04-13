const WaveDecoration = () => (
  <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
    <svg
      viewBox="0 0 1440 120"
      className="w-full h-16 md:h-20"
      preserveAspectRatio="none"
    >
      <path
        d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L0,120Z"
        fill="hsl(200 100% 43% / 0.08)"
      />
      <path
        d="M0,96L48,90.7C96,85,192,75,288,80C384,85,480,96,576,96C672,96,768,85,864,80C960,75,1056,80,1152,85.3C1248,91,1344,96,1392,98.7L1440,101L1440,120L0,120Z"
        fill="hsl(200 100% 43% / 0.04)"
      />
    </svg>
  </div>
);

export default WaveDecoration;
