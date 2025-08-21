import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Req,
  UseGuards,
  HttpException,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { JwtCookieGuard } from 'src/auth/jwt-cookie.guard';
import { Roles } from 'src/common/roles.decorator';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ResultDto } from 'src/common/dto/result.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtCookieGuard)
  @Roles('host')
  @Post()
  async create(@Body() dto: CreateNotificationDto): Promise<ResultDto<any>> {
    try {
      const notification = await this.notificationService.createAndSend(dto);
      return ResultDto.ok(notification, 'Notification sent successfully');
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Unexpected error creating notification:', error);
      throw new InternalServerErrorException('Failed to create notification');
    }
  }

  @UseGuards(JwtCookieGuard)
  @Get()
  async getUserNotifications(
    @Req() req: any,
    @Query('type') type?: string,
    @Query('read') read?: string,
  ): Promise<ResultDto<any[]>> {
    try {
      const notifications = await this.notificationService.getUserNotifications(
        req.user.sub,
        {
          type,
          read: read === 'true' ? true : read === 'false' ? false : undefined,
        },
      );
      return ResultDto.ok(
        notifications,
        'User notifications retrieved successfully',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Unexpected error fetching notifications:', error);
      throw new InternalServerErrorException('Failed to fetch notifications');
    }
  }

  @UseGuards(JwtCookieGuard)
  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<ResultDto<any>> {
    try {
      const result = await this.notificationService.markAsRead(
        id,
        req.user.sub,
      );
      return ResultDto.ok(result, 'Notification marked as read');
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Unexpected error marking notification as read:', error);
      throw new InternalServerErrorException(
        'Failed to mark notification as read',
      );
    }
  }

  @UseGuards(JwtCookieGuard)
  @Patch('read-all')
  async markAllAsRead(@Req() req: any): Promise<ResultDto<any>> {
    try {
      const result = await this.notificationService.markAllAsRead(req.user.sub);
      return ResultDto.ok(result, 'All notifications marked as read');
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(
        'Unexpected error marking all notifications as read:',
        error,
      );
      throw new InternalServerErrorException(
        'Failed to mark all notifications as read',
      );
    }
  }
}
