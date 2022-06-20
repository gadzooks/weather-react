import React from 'react';
import { Link } from "@mui/material";
import { RegionInterface } from "../../interfaces/RegionInterface";
import wtaLogo from '../../images/wta-logo.png';
import './WtaLink.scss';
//https://www.wta.org/go-outside/trip-reports/tripreport_search?title=&region=592fcc9afd9208db3b81fdf93dada567&subregion=all&searchabletext=&author=&startdate=&_submit=&enddate=&_submit=&month=all&format=list&filter=Search

interface WtaLinkProps {
    wtaRegion?: string,
    wtaSubRegion?: string,
}

const wtaLink = 'https://www.wta.org/go-outside/trip-reports/tripreport_search?title=&searchabletext=&author=&startdate=&_submit=&enddate=&_submit=&month=all&format=list&filter=Search';

function WtaLink(props: WtaLinkProps) {
    const regionValue = props.wtaRegion;
    const subRegionValue = props.wtaSubRegion || 'all';
    const link = wtaLink + `&region=${regionValue}&subregion=${subRegionValue}`
    return (
        <Link href={link}>
            <img src={wtaLogo} className='wta-logo' />
        </Link>
    )
}

export default WtaLink;