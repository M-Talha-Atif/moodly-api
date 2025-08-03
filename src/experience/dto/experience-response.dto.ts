import { Expose, Type } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';


class HostResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  avatarUrl: string;
}

export class ExperienceResponseDto {

   @Expose()
  @Type(() => HostResponseDto)
  host: HostResponseDto;


  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  date: Date;

  @Expose()
  location: string;

 
}


