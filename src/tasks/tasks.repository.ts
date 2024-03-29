import { Repository, DataSource } from 'typeorm';
import { Task } from './task.entity';
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UserEntity } from '../auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  getTasks = async (
    filterDto: GetTaskFilterDto,
    user: UserEntity,
  ): Promise<Task[]> => {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '((LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();
    return tasks;
  };

  createTask = async (
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<Task> => {
    const task = this.create({
      ...createTaskDto,
      status: TaskStatus.OPEN,
      user,
    });
    await this.save(task);
    return task;
  };
}
