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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CommunityService } from './services/community/community.service';
import { CommunityQueryService } from './services/community/community-query.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { ResultDto } from 'src/common/dto/result.dto';
import { CommunityMemberService } from './services/community/community-member.service';
import { CommunityPostService } from './services/posts/community-post.service';
import { Query } from '@nestjs/common';
import { CommunityReactionService } from './services/posts/reactions/community-reaction.service';
import { CommunityQueryDto } from './dto/community-query.dto';
import { CommunityCommentService } from './services/comments/community-comment.service';

@ApiTags('Communities')
@Controller('communities')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly communityQueryService: CommunityQueryService,
    private readonly communityMemberService: CommunityMemberService, // for community membership
    private readonly communityPostService: CommunityPostService, // for community posting
    private readonly communityReactionService: CommunityReactionService, // for reactions
    private readonly communityCommentService: CommunityCommentService, // for post comments
  ) { }

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
  @Get('/public')
  @ApiOperation({ summary: 'Get all communities (public)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'isPrivate', required: false, type: Boolean })
  @ApiQuery({ name: 'tags', required: false, type: [String] })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(@Query() query: CommunityQueryDto) {
    const communities = await this.communityQueryService.findAll(query);
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

    /**
   * Authenticated: Get communities with `isJoined`
   */
  @UseGuards(JwtCookieGuard)
  @Get()
  async findAllWithMembership(
    @Query() query: CommunityQueryDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub; // `JwtCookieGuard` puts user in request
    return this.communityQueryService.findAllWithMembership(userId, query);
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

  @UseGuards(JwtCookieGuard)
  @Get(':id/posts')
  async listPosts(
    @Param('id') communityId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Req() req,
  ) {
    const posts = await this.communityPostService.listPosts(
      communityId,
      Number(page),
      Number(limit),
      req.user.sub,
    );
    return ResultDto.ok(posts, 'Posts fetched');
  }

  @UseGuards(JwtCookieGuard)
  @Get('posts/:id')
  async getPost(@Param('id') postId: string, @Req() req) {
    const userId = req.user.sub; // Now this works
    const post = await this.communityPostService.getPost(postId, userId);
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

  // ================= Community Comments =================

  /**
   * Add a comment to a post
   */
  @UseGuards(JwtCookieGuard)
  @Post('posts/:id/comments')
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  async addComment(
    @Param('id') postId: string,
    @Body('content') content: string,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    const comment = await this.communityCommentService.addComment(
      userId,
      postId,
      content,
    );

    if (!comment) return ResultDto.fail('Cannot add comment', 400);

    return ResultDto.ok(comment, 'Comment added', 201);
  }

  /**
   * List all comments for a post
   */
  @Get('posts/:id/comments')
  async listComments(
    @Param('id') postId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = 10
  ) {
    const result = await this.communityCommentService.listComments(postId, cursor, Number(limit));
    return ResultDto.ok(result, 'Comments fetched successfully');
  }



  /**
   * Delete a comment by ID (author only)
   */
  @UseGuards(JwtCookieGuard)
  @Delete('posts/comments/:commentId')
  @ApiOperation({ summary: 'Delete a comment (author only)' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({
    status: 404,
    description: 'Comment not found or not authorized',
  })
  async deleteComment(@Param('commentId') commentId: string, @Req() req: any) {
    const userId = req.user.sub;
    const success = await this.communityCommentService.deleteComment(
      userId,
      commentId,
    );

    if (!success)
      return ResultDto.fail('Comment not found or not authorized', 404);

    return ResultDto.okEmpty();
  }
}
