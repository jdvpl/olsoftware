import { Test, TestingModule } from '@nestjs/testing';
import { MerchantsUseCase } from './merchants.use-case';
import { IMerchantsRepository } from './interfaces/merchants.repository';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { merchant } from '@prisma/client';

describe('MerchantsUseCase', () => {
  let useCase: MerchantsUseCase;
  let repository: IMerchantsRepository;

  const mockRepository = {
    create: jest.fn(),
    list: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    changeStatus: jest.fn(),
  };

  const mockMerchant: merchant = {
    id_merchant: 1,
    business_name: 'Test Business',
    id_municipio: 1,
    phone: '1234567890',
    optional_email: 'test@example.com',
    registration_date: new Date(),
    status: 'ACTIVE',
    updated_at: new Date(),
    updated_by: 'test@test.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MerchantsUseCase,
        {
          provide: 'IMerchantsRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<MerchantsUseCase>(MerchantsUseCase);
    repository = module.get<IMerchantsRepository>('IMerchantsRepository');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('create', () => {
    it('should create a merchant successfully', async () => {
      const createDto: CreateMerchantDto = {
        business_name: 'Test Business',
        id_municipio: 1,
        phone: '1234567890',
        optional_email: 'test@example.com',
        registration_date: new Date(),
        status: 'ACTIVE',
      };

      mockRepository.create.mockResolvedValue(mockMerchant);

      const result = await useCase.create(createDto, 'test@test.com');

      expect(repository.create).toHaveBeenCalledWith(
        createDto,
        'test@test.com',
      );
      expect(result).toEqual(mockMerchant);
    });
  });

  describe('list', () => {
    it('should return paginated merchants', async () => {
      const filters = { page: 1, limit: 5 };
      const paginatedResult = {
        items: [mockMerchant],
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
      };

      mockRepository.list.mockResolvedValue(paginatedResult);

      const result = await useCase.list(filters);

      expect(repository.list).toHaveBeenCalledWith(filters);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('find', () => {
    it('should find a merchant by id', async () => {
      mockRepository.findById.mockResolvedValue(mockMerchant);

      const result = await useCase.find(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMerchant);
    });

    it('should return null when merchant not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await useCase.find(999);

      expect(repository.findById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a merchant successfully', async () => {
      const updateDto: UpdateMerchantDto = {
        business_name: 'Updated Business',
      };
      const updatedMerchant = {
        ...mockMerchant,
        business_name: 'Updated Business',
      };

      mockRepository.update.mockResolvedValue(updatedMerchant);

      const result = await useCase.update(1, updateDto, 'test@test.com');

      expect(repository.update).toHaveBeenCalledWith(
        1,
        updateDto,
        'test@test.com',
      );
      expect(result).toEqual(updatedMerchant);
    });
  });

  describe('delete', () => {
    it('should delete a merchant successfully', async () => {
      mockRepository.remove.mockResolvedValue(undefined);

      await useCase.delete(1);

      expect(repository.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('setStatus', () => {
    it('should change merchant status successfully', async () => {
      const updatedMerchant = { ...mockMerchant, status: 'INACTIVE' as const };

      mockRepository.changeStatus.mockResolvedValue(updatedMerchant);

      const result = await useCase.setStatus(1, 'INACTIVE', 'test@test.com');

      expect(repository.changeStatus).toHaveBeenCalledWith(
        1,
        'INACTIVE',
        'test@test.com',
      );
      expect(result).toEqual(updatedMerchant);
    });
  });
});
