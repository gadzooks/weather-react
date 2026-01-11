// TripReports.tsx - Displays WTA trip reports with lazy loading

import React, { useState, useEffect } from 'react';
import type {
  TripReport,
  TripReportResponse,
} from '../../../interfaces/TripReportInterface';
import './TripReports.scss';

const WEATHER_API = import.meta.env.VITE_WEATHER_API;

interface TripReportsProps {
  wtaRegion?: string;
  wtaSubRegion?: string;
  isActive: boolean; // Only fetch when tab is active
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

function TripReportCard({ report }: { report: TripReport }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='trip-report-card'>
      <div className='trip-report-header' onClick={() => setExpanded(!expanded)}>
        {report.thumbnailUrl && (
          <img
            src={report.thumbnailUrl}
            alt={report.trailName}
            className='trip-report-thumbnail'
            loading='lazy'
          />
        )}
        <div className='trip-report-info'>
          <h3 className='trip-report-title'>{report.trailName}</h3>
          <div className='trip-report-meta'>
            <span className='trip-report-date'>{report.date}</span>
            <span className='trip-report-author'>by {report.author.name}</span>
          </div>
          {report.conditions.length > 0 && (
            <div className='trip-report-conditions'>
              {report.conditions.map((condition) => (
                <span key={condition} className='condition-badge'>
                  {condition}
                </span>
              ))}
            </div>
          )}
          <div className='trip-report-stats'>
            {report.photoCount > 0 && (
              <span className='photo-count'>{report.photoCount} photos</span>
            )}
            {report.helpfulCount > 0 && (
              <span className='helpful-count'>
                {report.helpfulCount} found helpful
              </span>
            )}
            <a
              href={report.reportUrl}
              target='_blank'
              rel='noreferrer'
              className='view-on-wta-link'
              onClick={(e) => e.stopPropagation()}
            >
              View on WTA
            </a>
          </div>
        </div>
        <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>
          {expanded ? '−' : '+'}
        </span>
      </div>
      {expanded && (
        <div className='trip-report-body'>
          <p>{report.body}</p>
          <a
            href={report.reportUrl}
            target='_blank'
            rel='noreferrer'
            className='view-on-wta'
          >
            View on WTA
          </a>
        </div>
      )}
    </div>
  );
}

function TripReports({ wtaRegion, wtaSubRegion, isActive }: TripReportsProps) {
  const [reports, setReports] = useState<TripReport[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Only fetch when tab becomes active and we haven't fetched yet
    if (!isActive || hasFetched || !wtaRegion) return;

    const fetchReports = async () => {
      setLoadingState('loading');
      setError(null);

      try {
        const params = new URLSearchParams({
          region: wtaRegion,
          page: String(page),
        });
        if (wtaSubRegion && wtaSubRegion !== 'all') {
          params.append('subregion', wtaSubRegion);
        }

        const response = await fetch(
          `${WEATHER_API}/api/wta/reports?${params.toString()}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch trip reports: ${response.status}`);
        }

        const json = await response.json();
        const data: TripReportResponse = json.data;

        setReports(data.reports);
        setTotalCount(data.totalCount);
        setLoadingState('success');
        setHasFetched(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoadingState('error');
      }
    };

    fetchReports();
  }, [isActive, hasFetched, wtaRegion, wtaSubRegion, page]);

  // Reset when region changes
  useEffect(() => {
    setHasFetched(false);
    setReports([]);
    setPage(1);
  }, [wtaRegion, wtaSubRegion]);

  if (!wtaRegion) {
    return (
      <div className='trip-reports-container'>
        <p className='no-region'>No region data available for trip reports.</p>
      </div>
    );
  }

  if (loadingState === 'idle' || (loadingState === 'loading' && !hasFetched)) {
    return (
      <div className='trip-reports-container'>
        <div className='loading-spinner'>
          <div className='spinner' />
          <p>Loading trip reports...</p>
        </div>
      </div>
    );
  }

  if (loadingState === 'error') {
    return (
      <div className='trip-reports-container'>
        <div className='error-message'>
          <p>Failed to load trip reports</p>
          <p className='error-detail'>{error}</p>
          <button
            type='button'
            onClick={() => {
              setHasFetched(false);
              setLoadingState('idle');
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='trip-reports-container'>
      <div className='trip-reports-header'>
        <span className='total-count'>
          {totalCount.toLocaleString()} trip reports
        </span>
      </div>
      <div className='trip-reports-list'>
        {reports.map((report) => (
          <TripReportCard key={report.id} report={report} />
        ))}
      </div>
      {reports.length === 0 && (
        <p className='no-reports'>No trip reports found for this area.</p>
      )}
    </div>
  );
}

export default TripReports;
