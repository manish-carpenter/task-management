import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Task } from './task.entity';
//import { Task } from './task.model';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { UserEntity } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}
  getTaskById = async (id: string, user: UserEntity): Promise<Task> => {
    //const found = await this.tasksRepository.findOneBy({ id: id });

    const found = await this.tasksRepository.findOne({
      where: { id: id, user: user },
    });

    if (!found) {
      throw new NotFoundException(`Task with ID: '${id}' not found`);
    }
    return found;
  };

  createTask = async (
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<Task> => {
    return await this.tasksRepository.createTask(createTaskDto, user);
  };

  deleteTaskById = async (id: string, user: UserEntity): Promise<void> => {
    const result = await this.tasksRepository.delete({ id, user });
    if (result.affected) {
      return;
    }
    throw new NotFoundException(`Task with ${id} is not found`);
  };

  updateTaskStatus = async (
    id: string,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<Task> => {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  };

  getTasks = async (
    filterDto: GetTaskFilterDto,
    user: UserEntity,
  ): Promise<Task[]> => {
    return this.tasksRepository.getTasks(filterDto, user);
  };

  //--- Without respository ---//
  // private tasks: Task[] = [];
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // createTask(createTaskDto: CreateTaskDto) {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }
  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((task) => task.id === id);
  //   if (!found) {
  //     throw new NotFoundException(`Task with ID: ${id} is not found`);
  //   }
  //   return found;
  // }
  // deleteTaskById(id: string): void {
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }
  // updateStatusById(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
  // getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   //do something with status
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   return tasks;
  // }
}
