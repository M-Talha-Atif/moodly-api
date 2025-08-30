export class BookingResponseDto {
  id: string;
  status: string;
  experience: {
    id: string;
    title: string;
    date: string; // change from Date to string
  };
  createdAt: string; // change from Date to string
}
