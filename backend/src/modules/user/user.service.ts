import { Injectable } from '@nestjs/common';
@Injectable()
export class UserService {
    findAll(sort: 'asc' | 'desc' = 'desc') {
        return { message: 'All users', sort };
    }

    findTopScorers() {
        return { message: 'Top Scorers' };
    }

    findOne(id: string) {
        return { message: 'One user', id };
    }

    create(input: any) {
        return { message: 'New user', input };
    }
}
