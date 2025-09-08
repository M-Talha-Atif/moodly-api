import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ExperienceService } from './services/experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';
import { UsersService } from 'src/users/users.service';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ExperienceResponseDto } from './dto/experience-response.dto';
import { plainToInstance } from 'class-transformer';
import { ExperienceListItemDto } from './dto/experience-list-item.dto';
import { ResultDto } from 'src/common/dto/result.dto';
import { ExperienceFiltersDto } from './dto/experience-filters.dto';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { S3Service } from 'src/common/services/s3.service';

@ApiTags('Experiences')
@Controller('experiences')
export class ExperienceController {
  constructor(
    private readonly experienceService: ExperienceService,
    private readonly userService: UsersService,
    private readonly s3Service: S3Service,
  ) {}

  // =============== Host CRUD =================

  @UseGuards(JwtCookieGuard, RolesGuard)
  @Roles('host')
  @Post()
  @ApiOperation({ summary: 'Create a new experience (host only)' })
  @ApiResponse({
    status: 201,
    description: 'Experience created successfully',
    type: ExperienceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async create(@Body() dto: CreateExperienceDto, @Req() req: any) {
    const user = await this.userService.findById(req.user.sub);
    if (!user) return ResultDto.fail('User not found', 404);

    const experience = await this.experienceService.create(dto, user);
    return ResultDto.ok(
      plainToInstance(ExperienceResponseDto, experience),
      'Experience created successfully',
      201,
    );
  }

  @UseGuards(JwtCookieGuard, RolesGuard)
  @Roles('host')
  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiOperation({ summary: 'Upload an image for an experience (host only)' })
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const exp = await this.experienceService.findOne(id);
    if (!exp) return ResultDto.fail('Experience not found', 404);
    if (exp.host.id !== req.user.sub)
      return ResultDto.fail('Unauthorized', 403);

    const url = await this.s3Service.uploadBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    // save image URL in experience record
    await this.experienceService.update(id, { image: url });

    return ResultDto.ok({ url }, 'Image uploaded successfully');
  }

  @UseGuards(JwtCookieGuard, RolesGuard)
  @Roles('host')
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateExperienceDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() req: any,
  ) {
    const exp = await this.experienceService.findOne(id);
    if (!exp) return ResultDto.fail('Experience not found', 404);
    if (exp.host.id !== req.user.sub)
      return ResultDto.fail('Unauthorized', 403);

    const updated = await this.experienceService.update(id, dto, file);

    return ResultDto.ok(
      plainToInstance(ExperienceResponseDto, updated),
      'Experience updated successfully',
    );
  }

  @UseGuards(JwtCookieGuard, RolesGuard)
  @Roles('host')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an experience (host only)' })
  @ApiResponse({ status: 200, description: 'Experience deleted successfully' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  async delete(@Param('id') id: string, @Req() req: any) {
    const exp = await this.experienceService.findOne(id);
    if (!exp) return ResultDto.fail('Experience not found', 404);
    if (exp.host.id !== req.user.sub)
      return ResultDto.fail('Unauthorized', 403);

    await this.experienceService.remove(id);
    return ResultDto.okEmpty();
  }

  // =============== Public Fetch =================

  @Get('public')
  async findAllPublic(@Query() filters: ExperienceFiltersDto) {
    const [data, total] = await this.experienceService.findAllPublic(filters);

    return ResultDto.ok(
      {
        data: plainToInstance(ExperienceListItemDto, data, {
          excludeExtraneousValues: true,
        }),
        meta: {
          total,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(total / filters.limit),
        },
      },
      'Public experiences fetched successfully',
    );
  }

  @UseGuards(JwtCookieGuard, RolesGuard)
  @Roles('user')
  @Get('user')
  async findAllForUser(@Req() req, @Query() filters: ExperienceFiltersDto) {
    const result = await this.experienceService.findAllForUser(
      req.user.sub,
      filters,
    );

    return ResultDto.ok(
      {
        data: plainToInstance(ExperienceListItemDto, result.data, {
          excludeExtraneousValues: true,
        }),
        meta: result.meta,
      },
      'User experiences fetched successfully',
    );
  }

  // =============== Single Fetch =================

  @UseGuards(JwtCookieGuard, RolesGuard)
  @Roles('user')
  @Get(':id')
  @ApiOperation({ summary: 'Get details of a single experience by ID' })
  @ApiResponse({
    status: 200,
    description: 'Experience fetched successfully',
    type: ExperienceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  async findOne(@Req() req, @Param('id') experienceId: string) {
    const userId = req.user.sub;
    const experience = await this.experienceService.findOneWithBooking(
      experienceId,
      userId,
    );
    if (!experience) return ResultDto.fail('Experience not found', 404);

    return ResultDto.ok(
      plainToInstance(ExperienceResponseDto, experience),
      'Experience fetched successfully',
    );
  }
}
