export interface MovieListItem {
  MovieID:      number;
  Title:        string;
  Description:  string;
  Duration:     number;
  ReleaseDate:  Date;
  Genre:        string[];
  Director:     string;
  PosterImg:    string;
  Language:     string;
  created_at:   string;   
  keywords:     string[]; 
}
