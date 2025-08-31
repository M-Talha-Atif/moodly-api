import {
  Controller,
  Get,
  Post,
  Put,
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
import { CommunityPostService } from './services/community-post.service';
import { Query } from '@nestjs/common'; // also fix the missing Query import
// src/community/community.controller.ts
import { CommunityReactionService } from './services/community-reaction.service';

@ApiTags('Communities')
@Controller('communities')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly communityQueryService: CommunityQueryService,
    private readonly communityMemberService: CommunityMemberService, // for community membership
    private readonly communityPostService: CommunityPostService, // for community posting
    private readonly communityReactionService: CommunityReactionService, // for reactions
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

  // Posting

  @Post(':id/posts')
  @UseGuards(JwtCookieGuard)
  async createPost(
    @Param('id') communityId: string,
    @Body() body: { content: string; mediaUrl?: string },
    @Req() req: any,
  ) {
    const post = await this.communityPostService.createPost(
      req.user.sub,
      communityId,
      body.content,
      body.mediaUrl,
    );
    if (!post) return ResultDto.fail('Cannot create post', 400);
    return ResultDto.ok(post, 'Post created', 201);
  }

  @Get(':id/posts')
  async listPosts(
    @Param('id') communityId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const posts = await this.communityPostService.listPosts(
      communityId,
      Number(page),
      Number(limit),
    );
    return ResultDto.ok(posts, 'Posts fetched');
  }

  @Get('posts/:id')
  async getPost(@Param('id') postId: string) {
    const post = await this.communityPostService.getPost(postId);
    if (!post) return ResultDto.fail('Post not found', 404);
    return ResultDto.ok(post, 'Post fetched');
  }

  @Delete('posts/:id')
  @UseGuards(JwtCookieGuard)
  @ApiOperation({ summary: 'Delete a post (author only)' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found or not authorized' })
  async deletePost(@Param('id') postId: string, @Req() req: any) {
    const userId = req.user.sub;
    const success = await this.communityPostService.deletePost(userId, postId);

    if (!success) {
      return ResultDto.fail('Post not found or you are not the author', 404);
    }

    return ResultDto.okEmpty();
  }

  // ================= Posting reactions =================
  // ================= Reactions =================

  @Put('posts/:id/reaction')
  @UseGuards(JwtCookieGuard)
  @ApiOperation({ summary: 'Add or update reaction (idempotent)' })
  async upsertReaction(
    @Param('id') postId: string,
    @Body() body: { type: string },
    @Req() req: any,
  ) {
    const reaction = await this.communityReactionService.upsertReaction(
      req.user.sub,
      postId,
      body.type,
    );

    if (!reaction) return ResultDto.fail('Cannot react to post', 400);
    return ResultDto.ok(reaction, 'Reaction set', 201);
  }

  @Delete('posts/:id/reaction')
  @UseGuards(JwtCookieGuard)
  @ApiOperation({ summary: 'Remove user reaction from a post' })
  async removeReaction(@Param('id') postId: string, @Req() req: any) {
    const success = await this.communityReactionService.removeReaction(
      req.user.sub,
      postId,
    );

    if (!success) return ResultDto.fail('Reaction not found', 404);
    return ResultDto.okEmpty();
  }

  @Get('posts/:id/reactions')
  @UseGuards(JwtCookieGuard) // optional, but needed for "userReaction"
  @ApiOperation({ summary: 'Get aggregated reactions for a post' })
  async listReactions(@Param('id') postId: string, @Req() req: any) {
    const data = await this.communityReactionService.listReactions(
      postId,
      req.user?.sub,
    );
    return ResultDto.ok(data, 'Reactions summary fetched');
  }
}
