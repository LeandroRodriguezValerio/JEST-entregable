import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksController } from './notebooks.controller';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { Notebook } from './entities/notebook.entity';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

describe('NotebooksController', () => {
  let controller: NotebooksController;
  let service: NotebooksService;
  

  let mockNotebooksService: any;

  beforeEach(async () => {
    mockNotebooksService = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [
        {
          provide: NotebooksService,
          useValue: mockNotebooksService,
        },
      ],
    }).compile();

    controller = module.get<NotebooksController>(NotebooksController);
    service = module.get<NotebooksService>(NotebooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new notebook and return it', async () => {
      const createDto: CreateNotebookDto = {
        title: 'Test Notebook',
        content: 'This is a test.',
      };
      const expectedResult: Notebook = { id: 1, ...createDto };
      mockNotebooksService.create.mockResolvedValue(expectedResult);
      
      const result = await controller.create(createDto);
      
      expect(result).toEqual(expectedResult);
    });

    it('debería lanzar HttpException en caso de error', async () => {
      const dto = { title: 'Failing notebook' };
      (service.create as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(controller.create(dto as any)).rejects.toThrow(
        new HttpException('Error creating notebook', HttpStatus.BAD_REQUEST),
      );
    });

    it('debería lanzar HttpException en caso de error', async () => {
      (service.findAll as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(controller.findAll()).rejects.toThrow(
        new HttpException('Error retrieving notebooks', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
    
  });

  describe('findAll', () => {
    it('should return an array of notebooks', async () => {
      const expectedResult: Notebook[] = [
        { id: 1, title: 'Test 1', content: 'Content 1' },
        { id: 2, title: 'Test 2', content: 'Content 2' },
      ];
      mockNotebooksService.findAll.mockResolvedValue(expectedResult);
      
      const result = await controller.findAll();
      
      expect(result).toEqual(expectedResult);
    });
  });
})