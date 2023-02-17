export interface LocationInterface {
  name: string;
  region: string;
  description: string;
  latitude: number;
  longitude: number;
  sub_region?: string;
}

export interface LocationDetailData extends LocationInterface {
  wtaRegionKey?: string;
  alertIds?: string[];
}

// eslint-disable-next-line max-len
export function serializeLocationData(location: LocationInterface, wtaRegionKey: string | undefined): string {
  const obj:LocationDetailData = {
    ...location,
  };
  if (wtaRegionKey) obj.wtaRegionKey = wtaRegionKey;
  return JSON.stringify(obj);
}

export function deserializeLocationData(str: string): LocationDetailData {
  return JSON.parse(str);
}
