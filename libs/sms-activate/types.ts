export interface GetRentNumberRequest {
  service: string;
}

export interface GetRentNumberResponse {
  status: string;
  phone: {
    id: number;
    endDate: string;
    number: string;
  }
}

export interface GetRentStatusRequest {
  id: string;
}

export interface GetRentStatusResponse {
  status: string;
  quantity: string;
  values: Record<string, {
    phoneFrom: string;
    text: string;
    service: string;
    date: string;
  }>
}


