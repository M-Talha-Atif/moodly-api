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
import { ExperienceService } from './experience.service';
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

@ApiTags('Experiences')
@Controller('experiences')
export class ExperienceController {
  constructor(
    private readonly experienceService: ExperienceService,
    private readonly userService: UsersService,
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
  @Put(':id')
  @ApiOperation({ summary: 'Update an experience (host only)' })
  @ApiResponse({
    status: 200,
    description: 'Experience updated successfully',
    type: ExperienceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateExperienceDto,
    @Req() req: any,
  ) {
    const exp = await this.experienceService.findOne(id);
    if (!exp) return ResultDto.fail('Experience not found', 404);
    if (exp.host.id !== req.user.sub)
      return ResultDto.fail('Unauthorized', 403);

    const updated = await this.experienceService.update(id, dto);
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
  @ApiOperation({ summary: 'Get paginated list of public experiences' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @ApiQuery({ name: 'cultureTags', required: false, example: 'art,music' })
  @ApiQuery({ name: 'time', required: false, example: 'morning' })
  @ApiQuery({ name: 'search', required: false, example: 'yoga' })
  @ApiResponse({
    status: 200,
    description: 'Public experiences fetched successfully',
  })
  async findAllPublic(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('cultureTags') cultureTags: string | string[],
    @Query('time') time: string,
    @Query('search') search: string,
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const tagsArray = Array.isArray(cultureTags)
      ? cultureTags
      : (cultureTags?.split(',') ?? []);

    const [data, total] = await this.experienceService.findAllPublic(
      pageNum,
      limitNum,
      tagsArray,
      time,
      search,
    );

    return ResultDto.ok(
      {
        data: plainToInstance(ExperienceListItemDto, data, {
          excludeExtraneousValues: true,
        }),
        meta: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Public experiences fetched successfully',
    );
  }

  // =============== User Fetch (Personalized) =================

  @UseGuards(JwtCookieGuard, RolesGuard)
  @Roles('user')
  @Get('user')
  @ApiOperation({ summary: 'Get personalized experiences for a user' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @ApiQuery({ name: 'cultureTags', required: false, example: 'art,music' })
  @ApiQuery({ name: 'time', required: false, example: 'morning' })
  @ApiQuery({ name: 'search', required: false, example: 'meditation' })
  @ApiResponse({
    status: 200,
    description: 'User experiences fetched successfully',
  })
  async findAllForUser(
    @Req() req,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('cultureTags') cultureTags: string | string[],
    @Query('time') time: string,
    @Query('search') search: string,
  ) {
    const userId = req.user.sub;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const tagsArray = Array.isArray(cultureTags)
      ? cultureTags
      : (cultureTags?.split(',') ?? []);

    const result = await this.experienceService.findAllForUser(
      userId,
      pageNum,
      limitNum,
      tagsArray,
      time,
      search,
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
