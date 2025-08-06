export class BookingResponseDto {
  id: string;
  status: string;
  experience: {
    id: string;
    title: string;
    date: Date;
  };
  createdAt: Date;
}
