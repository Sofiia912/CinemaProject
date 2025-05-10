export interface SessionView {
  SessionID:    number;
  StartAt:      string;    
  Price:        number;     
  MovieTitle:   string;    
  PosterImg:    string;     
  HallName: string;
  PriceGood:    number;
  PriceLux:     number;
}

/** Деталі одного сеансу */
export interface SessionDetail {
  SessionID:    number;
  MovieID:      number;
  MovieTitle:   string;
  Date:         string;    
  Time:         string;     
  Duration:     number;
  PosterImg:    string;
  HallName:     string;
  Price:        number;     
  PriceGood:    number;
  PriceLux:     number;
  Format:       string;     
}