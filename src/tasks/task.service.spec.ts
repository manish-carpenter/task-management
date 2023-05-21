import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';

const mockTasksRepository = () => {
  getTasks: jest.fn();
};

const mockUser = {
  username: 'abc',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

describe('TaskService', () => {
  let taskService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    //Initiallize a NestJS module with tastService and taskRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    taskService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTask', () => {
    it('calls TaskRepository.getTasks and return the result', async () => {
      // call tastsService.getTask, which should then call the repository's getTasks
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await taskService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });
});
