import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Put,
  Delete,
  Query,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ExperienceHostService } from '../services/host/experience-host.service';
import { UsersService } from 'src/users/users.service';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { CreateExperienceDto } from '../dto/create-experience.dto';
import { UpdateExperienceDto } from '../dto/update-experience.dto';
import { ExperienceResponseDto } from '../dto/experience-response.dto';
import { ResultDto } from 'src/common/dto/result.dto';
import { plainToInstance } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { S3Service } from 'src/common/services/s3.service';
import { AiExperienceService } from '../services/host/ai-experience.service';
import { JwtBearerGuard } from 'src/auth/guards/jwt-bearer.guard';
import { HostExperienceListItemDto } from '../dto/host/host-experience-list-item.dto';
import { HostExperienceFiltersDto } from '../dto/host/experience-filters-host.dto';

@ApiTags('Host Experiences')
@Controller('host/experiences')
@UseGuards(JwtCookieGuard, JwtBearerGuard, RolesGuard)
@Roles('host')
export class ExperienceHostController {
  constructor(
    private readonly experienceHostService: ExperienceHostService,
    private readonly userService: UsersService,
    private readonly s3Service: S3Service,
    private readonly aiExperienceService: AiExperienceService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new experience (host only)' })
  async create(@Body() dto: CreateExperienceDto, @Req() req: any) {
    const user = await this.userService.findById(req.user.sub);
    if (!user) return ResultDto.fail('User not found', 404);

    const experience = await this.experienceHostService.create(dto, user);
    return ResultDto.ok(
      plainToInstance(ExperienceResponseDto, experience),
      'Experience created successfully',
      201,
    );
  }

  @Post('generate')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiOperation({
    summary: 'Generate experience data using AI (voice or text)',
  })
  async generate(
    @UploadedFile() file?: Express.Multer.File,
    @Body('voiceText') voiceText?: string,
  ) {
    if (!file && !voiceText)
      return ResultDto.fail('Either voice file or voiceText is required', 400);

    const result = await this.aiExperienceService.handleVoiceOrTextInput(
      file,
      voiceText,
    );
    return ResultDto.ok(result, 'AI-generated experience data');
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const exp = await this.experienceHostService.findOne(id);
    if (!exp) return ResultDto.fail('Experience not found', 404);
    if (exp.host.id !== req.user.sub)
      return ResultDto.fail('Unauthorized', 403);

    const url = await this.s3Service.uploadBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    await this.experienceHostService.update(id, { image: url });
    return ResultDto.ok({ url }, 'Image uploaded successfully');
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateExperienceDto,
    @Req() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const exp = await this.experienceHostService.findOne(id);
    if (!exp) return ResultDto.fail('Experience not found', 404);
    if (exp.host.id !== req.user.sub)
      return ResultDto.fail('Unauthorized', 403);

    const updated = await this.experienceHostService.update(id, dto, file);
    return ResultDto.ok(
      plainToInstance(ExperienceResponseDto, updated),
      'Experience updated successfully',
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an experience (host only)' })
  async delete(@Param('id') id: string, @Req() req: any) {
    const exp = await this.experienceHostService.findOne(id);
    if (!exp) return ResultDto.fail('Experience not found', 404);
    if (exp.host.id !== req.user.sub)
      return ResultDto.fail('Unauthorized', 403);

    await this.experienceHostService.remove(id);
    return ResultDto.okEmpty();
  }

  @Get()
  @ApiOperation({ summary: 'Get all experiences for the current host' })
  async findAll(@Req() req: any, @Query() filters: HostExperienceFiltersDto) {
    const { data, meta } = await this.experienceHostService.findAllForHost(
      req.user.sub,
      filters,
    );

    return ResultDto.ok(
      {
        data: data.map((exp) =>
          plainToInstance(HostExperienceListItemDto, exp),
        ),
        meta,
      },
      'Experiences fetched successfully',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single experience (host only)' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const exp = await this.experienceHostService.findOneForHost(
      id,
      req.user.sub,
    );
    if (!exp)
      return ResultDto.fail('Experience not found or unauthorized', 404);

    // console.log(exp);

    return ResultDto.ok(
      plainToInstance(ExperienceResponseDto, exp),
      'Experience fetched successfully',
    );
  }

  @Get(':id/bookings')
  @ApiOperation({ summary: 'Get bookings for a host’s experience' })
  async getBookings(@Param('id') id: string, @Req() req: any) {
    const exp = await this.experienceHostService.findOneForHost(
      id,
      req.user.sub,
    );
    if (!exp)
      return ResultDto.fail('Experience not found or unauthorized', 404);

    const bookings =
      await this.experienceHostService.findBookingsForExperience(id);
    return ResultDto.ok(bookings, 'Bookings fetched successfully');
  }
}
