export class CreateUserDto {
    username: string;
    email: string;
    fullName?: string;
    status?: string;
    equipmentIds?: string[];
  }
  