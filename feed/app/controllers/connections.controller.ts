import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { ConnectionsService } from '../services/connections.service';
import {
  CreateConnectionDto,
  UpdateConnectionDto,
} from '../dtos/connection.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';

@ApiTags('connections')
@Controller('connections')
@ApiBearerAuth()
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new connection request' })
  @ApiResponse({
    status: 201,
    description: 'The connection request has been successfully created.',
  })
  create(
    @Body() createConnectionDto: CreateConnectionDto,
    @User() user: { user_id: number },
  ) {
    // Ensure the user can only create connection requests from themselves
    if (user.user_id !== createConnectionDto.requester_id) {
      throw new ForbiddenException(
        'You can only create connection requests from your own account',
      );
    }

    // Prevent self-connections
    if (createConnectionDto.requester_id === createConnectionDto.addressee_id) {
      throw new ForbiddenException('You cannot connect with yourself');
    }

    return this.connectionsService.create(createConnectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all connections for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Return all connections for the authenticated user.',
  })
  findByUser(@User() user: { user_id: number }) {
    return this.connectionsService.findByUser(user.user_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a connection by ID' })
  @ApiResponse({ status: 200, description: 'Return the connection.' })
  @ApiResponse({ status: 404, description: 'Connection not found.' })
  findOne(@Param('id') id: string) {
    return this.connectionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a connection status' })
  @ApiResponse({
    status: 200,
    description: 'The connection has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() updateConnectionDto: UpdateConnectionDto,
    @User() user: { user_id: number },
  ) {
    const connection = await this.connectionsService.findOne(+id);

    // Only the addressee can update the connection status
    if (connection?.addressee_id !== user.user_id) {
      throw new ForbiddenException(
        'Only the connection recipient can update the status',
      );
    }

    return this.connectionsService.update(+id, updateConnectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a connection' })
  @ApiResponse({
    status: 200,
    description: 'The connection has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async remove(@Param('id') id: string, @User() user: { user_id: number }) {
    const connection = await this.connectionsService.findOne(+id);

    // Either user in the connection can remove it
    if (
      connection?.requester_id !== user.user_id &&
      connection?.addressee_id !== user.user_id
    ) {
      throw new ForbiddenException('You can only delete your own connections');
    }

    return this.connectionsService.remove(+id);
  }
}
