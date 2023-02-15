/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import wtaLogo from '../../../images/wta-logo.png';
import './WtaLink.scss';

interface WtaLinkProps {
  wtaRegion?: string,
  wtaSubRegion?: string,
}

const wtaLink = 'https://www.wta.org/go-outside/trip-reports/tripreport_search?title=&searchabletext=&author=&startdate=&_submit=&enddate=&_submit=&month=all&format=list&filter=Search';

function WtaLink(props: WtaLinkProps) {
  if (props.wtaRegion === undefined && props.wtaSubRegion === undefined) {
    return null;
  }
  const regionValue = props.wtaRegion;
  const subRegionValue = props.wtaSubRegion || 'all';
  const link = `${wtaLink}&region=${regionValue}&subregion=${subRegionValue}`;
  return (
    <a href={link} target='_blank' rel='noreferrer'>
      <img src={wtaLogo} className='wta-logo' alt='wta-logo' />
    </a>
  );
}

export default WtaLink;
