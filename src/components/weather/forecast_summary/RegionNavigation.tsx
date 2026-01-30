// RegionNavigation.tsx
import './RegionNavigation.scss';

interface RegionNavigationProps {
  currentRegion: string; // slug format
  allRegions: { name: string; slug: string; description: string }[];
  onRegionChange: (regionSlug: string) => void;
}

function RegionNavigation({
  currentRegion,
  allRegions,
  onRegionChange,
}: RegionNavigationProps) {
  if (!currentRegion || allRegions.length === 0) return null;

  const currentIndex = allRegions.findIndex((r) => r.slug === currentRegion);
  if (currentIndex === -1) return null;

  const currentRegionData = allRegions[currentIndex];

  // Wrap around navigation: last -> first, first -> last
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : allRegions.length - 1;
  const nextIndex = currentIndex < allRegions.length - 1 ? currentIndex + 1 : 0;

  const prevRegion = allRegions[prevIndex];
  const nextRegion = allRegions[nextIndex];

  return (
    <div className='region-navigation'>
      <button
        type='button'
        className='region-nav-btn region-nav-prev'
        onClick={() => onRegionChange(prevRegion.slug)}
        aria-label={`Previous region: ${prevRegion.description}`}
        title={prevRegion.description}
      >
        <i className='wi wi-direction-left' />
        <span className='region-nav-label'>Previous</span>
      </button>

      <div className='region-nav-current'>
        <div className='region-nav-name'>{currentRegionData.description}</div>
        <div className='region-nav-count'>
          {currentIndex + 1} of {allRegions.length} regions
        </div>
      </div>

      <button
        type='button'
        className='region-nav-btn region-nav-next'
        onClick={() => onRegionChange(nextRegion.slug)}
        aria-label={`Next region: ${nextRegion.description}`}
        title={nextRegion.description}
      >
        <span className='region-nav-label'>Next</span>
        <i className='wi wi-direction-right' />
      </button>
    </div>
  );
}

export default RegionNavigation;
