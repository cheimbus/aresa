export interface HistoricalPriceDto {
  aptId: number;
  year: number;
  monthStart: number;
  monthEnd: number;
  value: number;
}

export interface FuturePriceDto {
  aptId: number;
  year: number;
  monthStart: number;
  monthEnd: number;
  value: number;
}
