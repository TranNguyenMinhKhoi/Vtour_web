export interface Station {
  _id: string;
  stationCode: string;
  stationName: string;
  city: string;
  province: string;
  stationType: 'main' | 'stop';
  isActive: boolean;
}

export interface RouteStop {
  stopId: Station | string;
  stopOrder: number;
  distanceFromStart: number;
  estimatedTimeFromStart: number;
  pickupPrice: number;
  dropoffPrice: number;
}

export interface Route {
  _id: string;
  routeCode: string;
  routeName: string;
  departureStationId: Station;
  arrivalStationId: Station;
  distance: number;
  estimatedDuration: number;
  basePrice: number;
  pricePerKm: number;
  stops: RouteStop[];
  description?: string;
  image?: string;
  isActive: boolean;
  popularityScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface RouteFormData {
  routeCode: string;
  routeName: string;
  departureStationId: string;
  arrivalStationId: string;
  distance: string;
  estimatedDuration: string;
  basePrice: string;
  pricePerKm: string;
  description: string;
  image: string;
  stops: RouteStop[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RouteResponse {
  success: boolean;
  routes: Route[];
  pagination: PaginationInfo;
}

export interface SingleRouteResponse {
  success: boolean;
  route: Route;
  message?: string;
}