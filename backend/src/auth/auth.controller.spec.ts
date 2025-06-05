import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LoginDto } from './application/dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let loginUseCase: LoginUseCase;

  const mockLoginUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: mockLoginUseCase,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const dto: LoginDto = {
      email: 'user@example.com',
      password: 'securepassword',
    };

    it('debería retornar un token y datos de usuario al iniciar sesión exitosamente', async () => {
      const mockResult = {
        access_token: 'jwt.token.here',
        user: {
          id: 1,
          name: 'Test User',
          email: dto.email,
          role: 'admin',
        },
      };

      mockLoginUseCase.execute.mockResolvedValueOnce(mockResult);

      const response = await controller.login(dto);

      expect(mockLoginUseCase.execute).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
      expect(response).toEqual({
        success: true,
        data: mockResult,
        message: 'Autenticación exitosa',
      });
    });

    it('debería lanzar una excepción 401 si las credenciales son inválidas', async () => {
      mockLoginUseCase.execute.mockRejectedValueOnce(
        new Error('Invalid credentials'),
      );

      await expect(controller.login(dto)).rejects.toThrow(HttpException);

      try {
        await controller.login(dto);
      } catch (error) {
        expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
        expect(error.getResponse()).toEqual({
          success: false,
          data: null,
          message: 'Credenciales inválidas',
          error: 'Invalid credentials',
        });
      }
    });
  });
});
