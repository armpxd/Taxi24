export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const R = 6371; // Earth radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

export const calculateDistanceBetweenLocations = (
  degreesLatitude1: number,
  degreesLongitude1: number,
  degreesLatitude2: number,
  degreesLongitude2: number,
): number => {
  const latitude1: number = convertDegreesToRadian(degreesLatitude1);
  const latitude2: number = convertDegreesToRadian(degreesLatitude2);
  const longitude1: number = convertDegreesToRadian(degreesLongitude1);
  const longitude2: number = convertDegreesToRadian(degreesLongitude2);

  const earthRadiusInKm: number = 6371.0088;

  const differenceInLatitude: number = latitude2 - latitude1;
  const differenceInLongitude: number = longitude2 - longitude1;

  const sqrtResult: number = Math.sqrt(
    Math.sin(differenceInLatitude / 2) * Math.sin(differenceInLatitude / 2) +
      Math.cos(latitude1) *
        Math.cos(latitude2) *
        Math.sin(differenceInLongitude / 2) *
        Math.sin(differenceInLongitude / 2),
  );

  const distance: number = 2 * earthRadiusInKm * Math.asin(sqrtResult);
  return parseFloat(distance.toFixed(6));
};

const convertDegreesToRadian = (degrees: number): number => {
  return (degrees / 180) * Math.PI;
};
