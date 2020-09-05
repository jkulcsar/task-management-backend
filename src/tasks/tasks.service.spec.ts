import { Test } from '@nestjs/testing'
import { TasksService } from './tasks.service'
import { TaskRepository } from './task.repository'
import { TaskStatus } from './tasks-status.enum'
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto'

const mockUser = { id: 12, username: 'Username' }
const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
})

describe('TasksService', () => {
  // notice that we are using both tasksService and taskRepository not strongly typed
  // otherwise the parameter types would be also strongly typed
  // and that's not needed for incrementally building up the testing conditions
  // for example just create a user as {id, username} instead of all the props
  // which are not (yet at least) tested
  let tasksService
  let taskRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile()

    tasksService = await module.get<TasksService>(TasksService)
    taskRepository = await module.get<TaskRepository>(TaskRepository)
  })

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled()

      taskRepository.getTasks.mockResolvedValue('someValue')

      // setup a filter DTO
      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search pattern here',
      }

      // call tasksService.getTasks
      const result = await tasksService.getTasks(filters, mockUser)
      expect(taskRepository.getTasks).toHaveBeenCalled()

      expect(result).toEqual('someValue')
    })
  })

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
      const mockTask = { title: 'Title', description: 'Description' }
      taskRepository.findOne.mockResolvedValue(mockTask)
      const result = await tasksService.getTaskById(1, mockUser)
      expect(result).toEqual(mockTask)

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      })
    })

    it('throws an error as task is not found', () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 })
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow()
    })
  })

  describe('updateTaskStatus', () => {
    it('update a tasks status', async () => {
      const save = jest.fn().mockResolvedValue(true)

      // setup the mock call
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      })

      // check that getTaskById has not yet been called
      expect(tasksService.getTaskById).not.toHaveBeenCalled()

      // call the mocked updateTaskStatus
      const result = await tasksService.updateTaskStatus(
        1,
        TaskStatus.DONE,
        mockUser,
      )

      // check that getTaskById has not yet been called
      expect(tasksService.getTaskById).toHaveBeenCalled()
      expect(save).toHaveBeenCalled()
      expect(result.status).toEqual(TaskStatus.DONE)
    })
  })
})
