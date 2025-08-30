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
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';
import { Roles } from 'src/common/roles.decorator';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ResultDto } from 'src/common/dto/result.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('notifications') // Swagger group
@ApiBearerAuth() // Requires JWT
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtCookieGuard)
  @Roles('host')
  @Post()
  @ApiOperation({ summary: 'Create and send a notification (host only)' })
  @ApiBody({ type: CreateNotificationDto })
  @ApiResponse({
    status: 201,
    description: 'Notification created and sent successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Failed to create notification' })
  async create(@Body() dto: CreateNotificationDto): Promise<ResultDto<any>> {
    try {
      const notification = await this.notificationService.createAndSend(dto);
      return ResultDto.ok(notification, 'Notification sent successfully');
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create notification');
    }
  }

  @UseGuards(JwtCookieGuard)
  @Get()
  @ApiOperation({ summary: 'Get all notifications for logged-in user' })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter notifications by type',
    example: 'reminder',
  })
  @ApiQuery({
    name: 'read',
    required: false,
    description: 'Filter by read/unread status (true/false)',
    example: 'false',
  })
  @ApiResponse({
    status: 200,
    description: 'User notifications retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
      throw new InternalServerErrorException('Failed to fetch notifications');
    }
  }

  @UseGuards(JwtCookieGuard)
  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiParam({ name: 'id', description: 'Notification ID', type: String })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
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
      throw new InternalServerErrorException(
        'Failed to mark notification as read',
      );
    }
  }

  @UseGuards(JwtCookieGuard)
  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async markAllAsRead(@Req() req: any): Promise<ResultDto<any>> {
    try {
      const result = await this.notificationService.markAllAsRead(req.user.sub);
      return ResultDto.ok(result, 'All notifications marked as read');
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to mark all notifications as read',
      );
    }
  }
}
