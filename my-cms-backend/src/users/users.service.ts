import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: DatabaseService) {}

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // Replace this with a real hashing function
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUserById(id: number, updateUserDto: UpdateUserDto) {
    let dataToSave = { ...updateUserDto };

    // Check if password is provided, and if so, hash it
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      dataToSave = {
        ...dataToSave,
        password: hashedPassword,
      };
    }

    return this.prisma.user.update({
      where: { id },
      data: dataToSave,
    });
  }

  async deleteUserById(id: number) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
