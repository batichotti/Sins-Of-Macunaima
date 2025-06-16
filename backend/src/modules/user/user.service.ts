import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    findAll(sort: 'asc' | 'desc' = 'desc') {
        return 'All users';
    }

    findTopScorers() {
        return 'Top Scorers';
    }

    findOne(id: string) {
        return 'One user';
    }

    create(input: any) {
        return 'New user';
    }
}
