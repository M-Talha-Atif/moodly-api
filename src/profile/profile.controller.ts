// import { Controller, Get, Req, UseGuards } from '@nestjs/common';
// import { JwtCookieGuard } from '../auth/guards/jwt-cookie.guard';
// import { ProfileService } from './profile.service';
// import { ResultDto } from '../common/dto/result.dto';

// @Controller('profile')
// export class ProfileController {
//   constructor(private readonly profileService: ProfileService) {}

//   @UseGuards(JwtCookieGuard)
//   @Get('overview')
//   async getOverview(@Req() req: any) {
//     const data = await this.profileService.getOverview(req.user.sub);
//     return ResultDto.ok(data, 'Profile overview fetched successfully');
//   }
// }
