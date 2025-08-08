import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  NotFoundException,
  Param,
  Put,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { JwtCookieGuard } from 'src/auth/jwt-cookie.guard';
import { UsersService } from 'src/users/users.service';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ExperienceResponseDto } from './dto/experience-response.dto';
import { plainToInstance } from 'class-transformer';
import { ExperienceListItemDto } from './dto/experience-list-item.dto';
import { Query } from '@nestjs/common';

@Controller('experiences')
export class ExperienceController {
  constructor(
    private readonly experienceService: ExperienceService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(JwtCookieGuard, RolesGuard)
  @Roles('host')
  @Post()
  async create(@Body() dto: CreateExperienceDto, @Req() req: any) {
    const user = await this.userService.findById(req.user.sub);
    if (!user) throw new NotFoundException('User not found');
    const experience = await this.experienceService.create(dto, user);
    return plainToInstance(ExperienceResponseDto, experience);
  }

  @UseGuards(JwtCookieGuard, RolesGuard)
  @Roles('host')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateExperienceDto,
    @Req() req: any,
  ) {
    const experience = await this.experienceService.findOne(id);
    if (!experience) throw new NotFoundException('Experience not found');
    if (experience.host.id !== req.user.sub)
      throw new ForbiddenException('Unauthorized');
    const updated = await this.experienceService.update(id, dto);
    return plainToInstance(ExperienceResponseDto, updated);
  }

  @UseGuards(JwtCookieGuard, RolesGuard)
  @Roles('host')
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    const experience = await this.experienceService.findOne(id);
    if (!experience) throw new NotFoundException('Experience not found');
    if (experience.host.id !== req.user.sub)
      throw new ForbiddenException('Unauthorized');
    await this.experienceService.remove(id);
    return { message: 'Deleted successfully' };
  }

  // Public GET for listing all experiences
  @Get()
  async findAll(
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

    const [data, total] = await this.experienceService.findAll(
      pageNum,
      limitNum,
      tagsArray,
      time,
      search,
    );

    return {
      data: plainToInstance(ExperienceListItemDto, data, {
        excludeExtraneousValues: true,
      }),
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  // Public GET for single experience, should be last
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const exp = await this.experienceService.findOne(id);
    if (!exp) throw new NotFoundException('Experience not found');
    return plainToInstance(ExperienceResponseDto, exp);
  }
}
