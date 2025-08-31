import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommunityService } from './services/community.service';
import { CommunityQueryService } from './services/community-query.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { ResultDto } from 'src/common/dto/result.dto';
import { CommunityMemberService } from './services/community-member.service';

@ApiTags('Communities')
@Controller('communities')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly communityQueryService: CommunityQueryService,
    private readonly communityMemberService: CommunityMemberService, // for community
  ) {}

  // =============== Host CRUD =================

  /**
   * Host creates a new community
   */
  @UseGuards(JwtCookieGuard, RolesGuard)
  @Roles('host')
  @Post()
  @ApiOperation({ summary: 'Create a new community (host only)' })
  @ApiResponse({ status: 201, description: 'Community created successfully' })
  async create(@Body() dto: CreateCommunityDto, @Req() req: any) {
    const ownerId = req.user.sub; // Extract host ID from JWT
    const community = await this.communityService.create(dto, ownerId);
    return ResultDto.ok(community, 'Community created successfully', 201);
  }

  /**
   * Host updates their community
   */
  @UseGuards(JwtCookieGuard, RolesGuard)
  @Roles('host')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a community (host only)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCommunityDto,
    @Req() req: any,
  ) {
    const updated = await this.communityService.updateWithOwnerCheck(
      id,
      dto,
      req.user.sub,
    );
    return ResultDto.ok(updated, 'Community updated successfully');
  }

  /**
   * Host deletes their community
   */
  @UseGuards(JwtCookieGuard, RolesGuard)
  @Roles('host')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a community (host only)' })
  async remove(@Param('id') id: string, @Req() req: any) {
    await this.communityService.removeWithOwnerCheck(id, req.user.sub);
    return ResultDto.okEmpty();
  }

  // =============== Public Fetch =================

  /**
   * Public endpoint: list all communities
   */
  @Get()
  @ApiOperation({ summary: 'Get all communities (public)' })
  async findAll() {
    const communities = await this.communityQueryService.findAll();
    return ResultDto.ok(communities, 'Communities fetched successfully');
  }

  /**
   * Public endpoint: get details of a single community
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get community by ID (public)' })
  @ApiResponse({ status: 404, description: 'Community not found' })
  async findOne(@Param('id') id: string) {
    const community = await this.communityQueryService.findOne(id);
    return ResultDto.ok(community, 'Community fetched successfully');
  }

  // =============== Membership Endpoints =================

  @UseGuards(JwtCookieGuard)
  @Post(':id/join')
  async join(@Param('id') communityId: string, @Req() req: any) {
    const userId = req.user.sub;
    const membership = await this.communityMemberService.joinCommunity(
      userId,
      communityId,
    );

    if (!membership) {
      return ResultDto.fail(
        'User already a member or invalid community/user',
        409,
      );
    }

    return ResultDto.ok(membership, 'Joined community successfully', 201);
  }

  @UseGuards(JwtCookieGuard)
  @Post(':id/leave')
  async leave(@Param('id') communityId: string, @Req() req: any) {
    const userId = req.user.sub;
    const success = await this.communityMemberService.leaveCommunity(
      userId,
      communityId,
    );

    if (!success) return ResultDto.fail('Not a member of this community', 404);

    return ResultDto.okEmpty();
  }

  @Get(':id/members')
  async listMembers(@Param('id') communityId: string) {
    const members = await this.communityMemberService.listMembers(communityId);
    return ResultDto.ok(members, 'Community members fetched successfully');
  }
}
